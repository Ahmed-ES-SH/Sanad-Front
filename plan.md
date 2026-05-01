# Direct Payment & Auto-Order Creation Integration

This plan implements the frontend flow for the Direct Payment integration as described in `DIRECT_PAYMENT_INTEGRATION_PLAN.md`. It updates the existing payment intent creation payload, aligns the frontend WebSocket listeners with the backend's `ORDER_CREATED` event, and handles routing to the newly created order.

## User Review Required

> [!WARNING]
> Please review the "Open Questions" section carefully, as it pertains to how the frontend handles the cart's multiple items versus the plan's expectation of a single `serviceId`.

## Open Questions

> [!IMPORTANT]
> **Cart Items vs Single Service ID:**
> The `DIRECT_PAYMENT_INTEGRATION_PLAN.md` dictates sending a single `serviceId` (string UUID) to `POST /api/payments/create-intent`. However, the current `CartPage` supports multiple items.
>
> - Are users restricted to a single item in the cart during checkout?
> - If the cart has multiple items, should the API be updated to accept an array of `serviceIds`, or should we extract and send `items[0].serviceId`? (The plan currently assumes we will use `items[0].serviceId` assuming a single-item cart model, but please clarify).

## Proposed Changes

---

### API Integration Helpers

#### [MODIFY] [createPaymentIntent.helper.ts](file:///c:/projects/Sanad/frontend/app/helpers/_cart/createPaymentIntent.helper.ts)

- **Change:** Update the `createPaymentIntent` signature to accept `userId: number` and `serviceId: string`.
- **Change:** Update the `POST /api/payments/create-intent` request body to include `userId` and `serviceId`, alongside the existing `amount` and `description`.

---

### Cart & Payment Components

#### [MODIFY] [CartPage.tsx](file:///c:/projects/Sanad/frontend/app/components/cart/CartPage.tsx)

- **Change:** Update the call to `createPaymentIntent` to pass `user.id` and `items[0].serviceId` (pending confirmation on the open question).
- **Change:** Integrate `useNotificationStore` to subscribe to the `popupNotifications` array.
- **Change:** Implement a `useEffect` hook that listens for new notifications of type `"ORDER_CREATED"`.
- **Change:** When an `"ORDER_CREATED"` notification arrives:
  - Stop the `isProcessingCheckout` loader and close the payment modal.
  - Check the `data.isRedirect` flag from the notification payload.
  - If `isRedirect` is true, silently redirect to `/orders/${orderId}` and display an info toast.
  - If `isRedirect` is false, redirect to `/orders/${orderId}?success=true` and display a success toast.
  - Dismiss the notification from the local store so it doesn't linger or trigger multiple redirects.
  - Clear the cart context.

#### [MODIFY] [PaymentModal.tsx](file:///c:/projects/Sanad/frontend/app/components/payment/PaymentModal.tsx)

- **Change:** Maintain the `pollPaymentStatus` as a fallback mechanism for UI updates, but rely on the `ORDER_CREATED` WebSocket event managed by `CartPage` for actual routing and success confirmation.
- **Change:** Use the `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` environment variable directly as already correctly implemented, abiding by the `stripe-best-practices` guidelines.

## Verification Plan

### Automated / Manual Verification

- Add items to the cart and click "Secure Checkout".
- Verify that the `POST /api/payments/create-intent` payload now includes `userId` and `serviceId`.
- Complete a test payment using Stripe test cards in the `PaymentModal`.
- Verify that upon payment success, the backend WebSocket event `ORDER_CREATED` is caught by `CartPage`.
- Verify the user is successfully redirected to `/orders/{orderId}` and the cart is cleared.
