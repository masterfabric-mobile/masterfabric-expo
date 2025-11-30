# 2. Installation

### Clone the Repository

First, clone the project repository to your local machine using Git and navigate into the project directory.
```bash
git clone <your-repository-url>
cd voice-ai-app
```

### Install Core Dependencies

Install the main project dependencies defined in `package.json`.
```bash
npm install
```

### Install Integration Packages

Install the additional packages required for third-party service integrations.

```bash
# Authentication (Supabase)
npm install @supabase/supabase-js @react-native-async-storage/async-storage

# Analytics (Firebase) & Push Notifications (OneSignal)
npm install @react-native-firebase/app @react-native-firebase/analytics react-native-onesignal

# Payments (Stripe)
npm install @stripe/stripe-react-native

# Advertisements (Google & Meta)
npm install react-native-google-mobile-ads react-native-fbads
```
