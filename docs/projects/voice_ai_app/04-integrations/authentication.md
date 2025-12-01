# Authentication with Supabase

- **Service**: **Supabase**
- **Description**: Handles all aspects of user authentication, including sign-up, sign-in, session management, and password recovery. The logic is abstracted in `src/services/auth/supabase_auth.ts` to provide a clean interface for the rest of the application.
- **Configuration**: `src/config/auth.ts`
- **Required Packages**:
  ```bash
  npm install @supabase/supabase-js
  npm install @react-native-async-storage/async-storage
  ```
- **Notes**: Supabase's JavaScript client requires an `async-storage` adapter to persist user sessions in a React Native environment. This is a critical piece for keeping users logged in between app launches.
