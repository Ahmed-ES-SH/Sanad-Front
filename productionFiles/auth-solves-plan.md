# Auth Fix Plan

## Goal
Make auth fully consistent with the backend contract:

- keep auth cookie-based
- do **not** introduce Bearer-token frontend auth
- do **not** read `sanad_auth_token` in client code
- for server-side requests, manually forward `sanad_auth_token` when present

---

## Phase 1 — Fix the server-side auth transport first

### 1.1 Update `globalRequest` to forward `sanad_auth_token` manually
**Files:** `app/helpers/globalRequest.ts`, optionally reuse `app/helpers/session.ts`

### Changes
- Read cookies with `next/headers` only on the server.
- Check whether `sanad_auth_token` exists.
- If it exists, append `Cookie: sanad_auth_token=<value>` manually to the outgoing backend request headers.
- Keep `credentials: "include"`, but do not rely on it as the only mechanism.
- Avoid adding `Authorization: Bearer ...`.

### Expected result
- `getCurrentUserAction`
- `logoutAction`
- `updateProfileAction`
- any future auth server actions

will start behaving as authenticated backend requests.

### Validation
- Log in once from the browser.
- Call a server action that hits `/api/auth/current-user`.
- Confirm backend receives `sanad_auth_token` and returns the real user.

---

## Phase 2 — Remove invalid client-side cookie access

### 2.1 Remove/replace `getClientAuthToken`
**File:** `app/helpers/session.ts`

### Changes
- Remove the client helper that parses `document.cookie` for `sanad_auth_token`.
- Keep server-only cookie helpers only.
- If a client helper is still needed, rename/document it as unsupported for `httpOnly` auth and stop using it.

### 2.2 Stop reading the auth cookie in notification store
**File:** `app/store/NotificationSlice.tsx`

### Changes
- Remove `getClientToken()` usage.
- Let socket connection rely on cookie transport only if backend socket auth already supports cookies.
- If backend socket auth requires an explicit token, add a dedicated server-assisted handshake/endpoint instead of reading the auth cookie in the browser.

### Backend alignment check
Confirm with backend whether Socket.IO auth should use:
- cookie-based handshake (`withCredentials: true`), or
- a separate server-generated socket token flow.

---

## Phase 3 — Rehydrate auth state correctly in the UI

### 3.1 Fetch the current user on the server
**Likely files:** `app/components/global/_navbar/Navbar.tsx`, or a higher App Router layout/provider

### Changes
- After Phase 1 is complete, fetch current user server-side using `getCurrentUserAction()`.
- Pass that user into the client boundary as `initialUser`.

### 3.2 Restore the client sync path
**Files:** `app/components/global/_navbar/ClientDiv.tsx`, `app/store/AuthSlice.tsx`

### Changes
- Re-enable the logic that writes `initialUser` into the auth store.
- Optionally add a dedicated `hydrateUser(initialUser)` action to avoid ad-hoc store writes.

### Expected result
- refresh keeps navbar/auth-gated UI consistent
- `Joinbtn`, `MobileSidebar`, `UserButton`, cart gates, and notification UI all reflect real cookie auth

---

## Phase 4 — Make logout truthful and safe

### 4.1 Return the real logout result
**Files:** `app/actions/authActions.ts`, `app/store/AuthSlice.tsx`

### Changes
- `logoutAction()` must return `success: false` when backend logout fails.
- Preserve backend error message/status.
- In the store, only clear local user state after confirmed logout success.
- On failure, keep the user state and show an error toast/message.

### Expected result
No more fake “logged out successfully” state while the backend cookie/session still exists.

---

## Phase 5 — Repair broken auth routes and page flow logic

### 5.1 Fix forgot-password success navigation
**File:** `app/components/auth/ForgotPasswordForm.tsx`

### Changes
Choose one:
- create a real `check-your-inbox` auth route/page, or
- redirect to an existing route that already renders the inbox confirmation UI.

### 5.2 Split “verify token” UI from “check your inbox” UI
**Files:** `app/components/auth/_signUp/SignupForm.tsx`, `app/components/auth/VerifyEmailContent.tsx`

### Changes
- Keep `/verify-email` for actual `token` verification only.
- Do not use `/verify-email?email=...` as a post-signup landing page.
- After signup, redirect to either:
  - login page with explanatory copy, or
  - a dedicated “registration complete / try login to trigger verification” page.
- For unverified login `403`, redirect to a proper inbox/help screen, since backend sends the email at that point.

### 5.3 Handle missing reset-password params explicitly
**File:** `app/components/auth/ResetPasswordForm.tsx`

### Changes
- If `token` or `e` is missing, stop loading immediately.
- Show an invalid-link state with CTA back to forgot-password/sign-in.
- Only show the spinner while an actual verification request is in flight.

---

## Phase 6 — Align frontend types with backend payloads

### 6.1 Fix signup response typing
**File:** `app/actions/authActions.ts`

### Changes
- Change signup result typing to match backend’s direct user entity response.
- Return a normalized frontend shape if needed, but derive it from the real payload.
- Remove assumptions that signup returns `{ user: ... }` unless backend actually changes.

### Expected result
Future signup flows can safely consume the returned user object without silent `undefined` values.

---

## Suggested Implementation Order

1. `globalRequest` cookie forwarding
2. remove client cookie reads
3. current-user fetch + auth store hydration
4. truthful logout handling
5. forgot-password / verify-email / reset-password route fixes
6. signup response typing cleanup

---

## QA Checklist

### Login / session
- [ ] login sets `sanad_auth_token`
- [ ] server-side `current-user` call works after refresh
- [ ] navbar shows authenticated UI after refresh
- [ ] logout actually invalidates backend session
- [ ] failed logout does not clear UI state incorrectly

### Signup / email verification
- [ ] signup no longer claims that a verification email was already sent
- [ ] unverified login `403` sends user to a valid inbox/help flow
- [ ] `/verify-email?token=...` only handles real token verification

### Forgot / reset password
- [ ] forgot-password success lands on a valid page
- [ ] reset-password invalid links show error UI, not endless spinner
- [ ] valid reset token still allows password change successfully

### Notifications / socket
- [ ] notification socket does not depend on reading `httpOnly` cookie in the browser
- [ ] socket auth approach is aligned with backend expectations

---

## Notes for Backend Coordination

Please keep these checks aligned with backend while implementing:

1. `POST /api/auth/login` still sets `sanad_auth_token` as `httpOnly`.
2. `POST /api/auth/logout` should clear the cookie/session consistently.
3. `GET /api/auth/current-user` should accept the forwarded cookie.
4. Socket auth method must be explicitly agreed: cookie handshake vs dedicated socket token.
5. Signup remains `POST /api/user` unless backend changes it.
6. Verify-email UX must reflect the real backend rule: mail is triggered on unverified login, not on signup.
