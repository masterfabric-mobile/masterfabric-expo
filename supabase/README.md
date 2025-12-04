# Supabase Database Scripts

This directory contains SQL scripts for setting up the Supabase database.

## Files

### Migrations
- `migrations/001_create_ataturk_table.sql` - Creates the `ataturk` table with public access policies

### Seed Data
- `seed/ataturk_seed.sql` - Seed data for the `ataturk` table

## Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `migrations/001_create_ataturk_table.sql`
4. Click **Run** to execute the script
5. The table will be created with seed data automatically

### Option 2: Using Supabase CLI

```bash
# Make sure you have Supabase CLI installed
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run the migration
supabase db push

# Or apply the migration file directly
supabase db execute migrations/001_create_ataturk_table.sql
```

### Option 3: Manual Execution

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy the entire content from `migrations/001_create_ataturk_table.sql`
4. Paste it into the SQL Editor
5. Click **Run** or press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac)

## Table Structure

The `ataturk` table contains the following columns:

- `id` (BIGSERIAL PRIMARY KEY) - Auto-incrementing ID
- `title` (TEXT) - Title of the event/information
- `description` (TEXT) - Detailed description
- `category` (TEXT) - Category (Biography, Reform, Military, etc.)
- `year` (INTEGER) - Year of the event
- `location` (TEXT) - Location where the event occurred
- `significance` (TEXT) - Historical significance
- `image_url` (TEXT) - Optional image URL
- `created_at` (TIMESTAMP) - Auto-generated creation timestamp
- `updated_at` (TIMESTAMP) - Auto-updated modification timestamp

## Public Access

The table is configured with Row Level Security (RLS) enabled but with public access policies:
- ✅ Public SELECT (read) - No authentication required
- ✅ Public INSERT (create) - No authentication required
- ✅ Public UPDATE (update) - No authentication required
- ✅ Public DELETE (delete) - No authentication required

This means anyone can query the `ataturk` table without being authenticated.

## Quick Queries

You can use these queries in the Supabase Database page:

```sql
-- Get all records
SELECT * FROM ataturk ORDER BY year ASC;

-- Get all reforms
SELECT * FROM ataturk WHERE category = 'Reform' ORDER BY year ASC;

-- Get records by year range
SELECT * FROM ataturk WHERE year BETWEEN 1920 AND 1930 ORDER BY year ASC;

-- Count total records
SELECT COUNT(*) as total FROM ataturk;

-- Get records by category
SELECT category, COUNT(*) as count FROM ataturk GROUP BY category;
```

## Notes

- The migration script includes seed data (18 records about Ataturk)
- The table uses RLS but allows public access
- Indexes are created on `category` and `year` for better query performance
- An automatic trigger updates the `updated_at` timestamp on record updates

