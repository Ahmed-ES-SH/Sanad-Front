# Auth Issues Report

## Scope
Reviewed the requested auth files and the shared auth/request utilities they depend on:

- `app/store/AuthSlice.tsx`
- `app/components/auth/SignupForm.tsx`
- `app/components/auth/_signUp/SignupForm.tsx`
- `app/components/auth/_signin/SignInForm.tsx`
- `app/components/auth/ForgotPasswordForm.tsx`
- `app/[locale]/(routes)/(auth)/reset-password/page.tsx`
- `app/[locale]/(routes)/(auth)/verify-email/page.tsx`
- Related infra:
  - `app/helpers/globalRequest.ts`
  - `app/actions/authActions.ts`
  - `app/helpers/session.ts`
  - `app/store/NotificationSlice.tsx`
  - `app/components/global/_navbar/Navbar.tsx`
  - `app/components/global/_navbar/ClientDiv.tsx`
  - `integrations/auth-integration-plan.md`

## Non-Negotiable Backend Constraints
From `integrations/auth-integration-plan.md` and your note:

1. Auth is cookie-based through `sanad_auth_token`.
2. Do **not** change frontend auth to Bearer-token flow.
3. Do **not** rely on `credentials: "include"` alone for server-side requests.
4. In server code, if `sanad_auth_token` exists in cookies, it must be forwarded manually.
5. Do **not** try to read `sanad_auth_token` on the client; it is `httpOnly`.

---

## Findings

### 1) `globalRequest` does not forward the `httpOnly` auth cookie to the backend on server-side calls
- **Priority:** P1
- **Files:** `app/helpers/globalRequest.ts:54-69`
- **Affected flows:** current user, logout, profile update, and any future authenticated server action using `globalRequest`
- **Problem:** `globalRequest` is a server utility, but it only sets `credentials: "include"`. In Next server runtime, that does not automatically forward the browser's incoming cookie jar to an external backend API.
- **Impact:** authenticated server requests can behave as anonymous requests even when the browser already has a valid `sanad_auth_token` cookie.
- **Why it matters here:** this directly conflicts with the backend integration plan and your explicit requirement.

### 2) Client code still tries to read the `httpOnly` auth cookie
- **Priority:** P1
- **Files:**
  - `app/helpers/session.ts:15-19`
  - `app/store/NotificationSlice.tsx:66-69`
- **Problem:** both helpers read `document.cookie` to extract `sanad_auth_token`.
- **Impact:** `httpOnly` cookies are not available to client JavaScript, so these paths always return `null`/empty in real auth scenarios.
- **Observed consequence:** notification socket auth falls back to an undefined token even though the user may actually be logged in.

### 3) Auth state is never rehydrated from the server cookie after refresh/navigation
- **Priority:** P1
- **Files:**
  - `app/store/AuthSlice.tsx:19-25`
  - `app/components/global/_navbar/Navbar.tsx:11-13`
  - `app/components/global/_navbar/ClientDiv.tsx:32-36`
- **Problem:** the store starts with `user: null`, `Navbar` always passes `initialUser={null}`, and the only client-to-store sync block is commented out.
- **Impact:** after a full refresh, the browser may still be authenticated by cookie, but UI based on `useAuthStore()` shows the user as logged out until a manual login happens again.
- **User-visible symptoms:** `Joinbtn`, `MobileSidebar`, and `UserButton` render the wrong auth state.

### 4) Logout always reports success even when the backend logout request fails
- **Priority:** P1
- **Files:**
  - `app/actions/authActions.ts:92-104`
  - `app/store/AuthSlice.tsx:35-47`
- **Problem:** `logoutAction()` returns success unconditionally, and the store clears the user immediately.
- **Impact:** if the backend logout request fails, the `sanad_auth_token` cookie/session can remain valid while the UI claims the user is logged out.
- **Risk:** the next server-authenticated request can silently restore the session, causing inconsistent and misleading auth behavior.

### 5) Forgot-password success redirects to a route that does not exist
- **Priority:** P1
- **Files:** `app/components/auth/ForgotPasswordForm.tsx:38-40`
- **Problem:** successful requests navigate to `/${locale}/check-your-inbox`, but there is no `app/[locale]/(routes)/(auth)/check-your-inbox/page.tsx` route.
- **Impact:** users can complete the API request successfully and then land on a 404 page.

### 6) Signup success sends users to the verify-email page even though signup does not send a verification email
- **Priority:** P2
- **Files:**
  - `app/components/auth/_signUp/SignupForm.tsx:63-67`
  - `app/components/auth/VerifyEmailContent.tsx:47-50,79`
- **Problem:** after signup, users are redirected to `/verify-email?email=...`, but the backend contract says signup does not trigger a verification email. The page then falls back to a “check your inbox” UI when no token is present.
- **Impact:** the UI tells users to look for an email that the backend has not sent yet, creating a false-success path.
- **Backend mismatch:** the documented flow is signup -> login -> backend sends verification mail on `403` for unverified users.

### 7) `registerAction` expects the wrong response shape from the signup endpoint
- **Priority:** P2
- **Files:** `app/actions/authActions.ts:58-86`
- **Problem:** the code types signup response as `{ user: User }` and returns `res.data!.user`, but the integration plan says `POST /api/user` returns the saved user entity directly.
- **Impact:** `response.data.user` becomes `undefined`, and any future logic that consumes the registered user payload will break or require defensive null checks.
- **Current status:** partially masked because the current signup UI only uses `response.success/message`.

### 8) Reset-password page can stay in an infinite loading state when query params are missing
- **Priority:** P2
- **Files:** `app/components/auth/ResetPasswordForm.tsx:37-55`
- **Problem:** token validation only runs when both `token` and `e` exist. If either is missing, `isTokenValid` never changes and the spinner never ends.
- **Impact:** malformed or incomplete reset links trap the user on a permanent loading screen instead of showing an error and recovery path.

---

## Recommended Fix Order

1. Fix server-side cookie forwarding in `globalRequest`.
2. Remove all client-side reads of `sanad_auth_token`.
3. Rehydrate auth state from a server-fetched current user.
4. Make logout success depend on the real backend response.
5. Repair broken route/flow handling for forgot password, signup verification, and reset-password edge cases.
6. Align `registerAction` with the real backend signup response shape.

## Overall Assessment
The current auth implementation has a solid endpoint/constants structure, but the cookie-based integration is not wired correctly end-to-end yet. The most important gap is that authenticated server requests are not actually forwarding `sanad_auth_token`, which undermines the intended `httpOnly` auth model.
