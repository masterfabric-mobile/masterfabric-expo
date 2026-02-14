# Recipio: Supabase Backend

This directory contains the database schema, migrations, and seed data for the Recipio project. It is managed by the [Supabase CLI](https://supabase.com/docs/guides/cli).

## Local Development Setup

### 1. Install the Supabase CLI

Follow the instructions for your OS: [Supabase CLI Installation](https://supabase.com/docs/guides/cli#installation).

### 2. Link Your Project (First time only)

If you are connecting this local setup to a remote Supabase project on `supabase.com`, run:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_ID
```

You can find `YOUR_PROJECT_ID` in your Supabase project's URL (`https://app.supabase.com/project/YOUR_PROJECT_ID`).

### 3. Start the Local Supabase Stack

To run Supabase services locally (Postgres, GoTrue, Storage, etc.), use the following command. This will start a Docker container with the required services.

```bash
supabase start
```

On the first run, this will download the necessary Docker images. After starting, the CLI will output local Supabase credentials, including the anonymous key, service role key, and database URL. These should be placed in a `.env.local` file at the root of your Next.js project.

**Example `.env.local`:**

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key
```

## Database Management

### Running Migrations

To apply all new migrations from the `/supabase/migrations` folder to your local database, run:

```bash
supabase db reset
```

This command completely wipes your local database and re-applies all migrations from scratch. It's the most reliable way to ensure a clean state during development. It will also run the `seed.sql` file automatically after the migrations.

### Creating a New Migration

If you make changes to your local database using `supabase studio` or another DB client, you can generate a new migration file by running:

```bash
supabase db diff -f your_migration_name
```

This will compare your local database schema to the last migration and generate a new SQL file in the `/migrations` directory.

### Seeding Data

The `supabase db reset` command automatically runs the `/supabase/seed/seed.sql` script. If you want to re-seed the data without resetting the schema, you would need to manually execute the SQL from the `seed.sql` file against your local database.

## Making a User an Admin

The seed script cannot automatically assign an admin role because user IDs are generated dynamically. To set an admin user:

1.  Sign up for a new account in the Recipio web application.
2.  Find your user ID. You can do this by:
    -   Looking in the `auth.users` table in the Supabase Studio.
    -   Logging the user object in the Next.js app.
3.  Execute the following SQL command in the Supabase SQL Editor:

```sql
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = 'paste-your-user-id-here';
```

You now have admin privileges and can access the `/admin` routes in the application.
