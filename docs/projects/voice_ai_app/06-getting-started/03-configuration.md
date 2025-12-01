# 3. Configuration

The application requires API keys and other secret credentials to connect to external services.

### Create Environment File

Copy the example environment file `.env.example` to a new file named `.env`. This file is git-ignored and will store your local secrets.

```bash
cp .env.example .env
```

### Fill in Environment Variables

Open the newly created `.env` file in a text editor and provide the required keys.

```
# .env

# Supabase Credentials
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_ANON_KEY=<your-supabase-anon-key>

# OneSignal App ID
ONE_SIGNAL_APP_ID=<your-onesignal-app-id>

# Stripe Publishable Key
STRIPE_PUBLISHABLE_KEY=<your-stripe-pk-key>

# ...add other keys as needed
```
