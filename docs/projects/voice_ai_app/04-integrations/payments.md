# Payments with Stripe & Iyzico

This application integrates multiple payment providers to handle subscriptions effectively across different regions.

---

### **Stripe**

- **Description**: The primary global payment processing platform used for handling Gold and Diamond subscription payments. The integration logic is contained in `src/services/payments/stripe_service.ts`.
- **Configuration**: `src/config/payments.ts`
- **Required Packages**:
  ```bash
  npm install @stripe/stripe-react-native
  ```
- **Usage**: Stripe's React Native SDK is used to securely collect payment details and process transactions for recurring subscriptions.

---

### **Iyzico**

- **Description**: Provides a regional payment gateway alternative, which can be crucial for user adoption in specific markets like Turkey. The implementation is found in `src/services/payments/iyzico_service.ts`.
- **Configuration**: `src/config/payments.ts`
- **Required Packages**:
  ```bash
  # Assuming a hypothetical package, as an official one may not exist.
  npm install iyzico-react-native-sdk
  ```
- **Notes**: Integrating Iyzico in React Native often requires a different approach than Stripe. It might involve using a `WebView` to host the payment page or communicating with a custom backend that handles the Iyzico API calls securely.
