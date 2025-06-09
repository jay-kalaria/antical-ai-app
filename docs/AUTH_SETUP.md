# Authentication Setup Guide

## Overview

Your Nutricado app now has a complete authentication system using Supabase Auth. Here's what has been implemented and what you need to do to complete the setup.

## What's Been Implemented

### 1. Authentication Context (`contexts/AuthContext.jsx`)

-   User session management
-   Sign up, sign in, sign out functions
-   Password reset functionality
-   Real-time auth state changes

### 2. Authentication Screens

-   **Login Screen** (`app/(auth)/login.jsx`) - Email/password login
-   **Signup Screen** (`app/(auth)/signup.jsx`) - User registration with email verification
-   **Forgot Password** (`app/(auth)/forgot-password.jsx`) - Password reset flow

### 3. Route Protection

-   **Index Route** (`app/index.jsx`) - Redirects users based on auth status
-   **Auth Layout** (`app/(auth)/_layout.jsx`) - Stack navigator for auth screens

### 4. Profile Integration

-   Updated profile screen to show authenticated user info
-   Added sign out functionality
-   Displays user name from auth metadata

### 5. Data Security

-   Updated meal service to filter data by authenticated user
-   All meal operations now require authentication

## Required Setup Steps

### 1. Supabase Configuration

Make sure your `.env` file has these variables:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Schema Updates

You'll need to update your Supabase database schema to support user authentication:

```sql
-- Add user_id column to meal_logs table
ALTER TABLE meal_logs
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX idx_meal_logs_user_id ON meal_logs(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own meals
CREATE POLICY "Users can only see their own meals" ON meal_logs
    FOR ALL USING (auth.uid() = user_id);

-- Update other related tables if needed
ALTER TABLE meal_ingredients
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE meal_nutrition
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable RLS on related tables
ALTER TABLE meal_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_nutrition ENABLE ROW LEVEL SECURITY;

-- Create policies for related tables
CREATE POLICY "Users can only see their own meal ingredients" ON meal_ingredients
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own meal nutrition" ON meal_nutrition
    FOR ALL USING (auth.uid() = user_id);
```

### 3. Supabase Auth Configuration

In your Supabase dashboard:

1. **Go to Authentication > Settings**
2. **Disable email confirmations** (for easier testing):
    - Uncheck "Enable email confirmations"
    - This allows users to sign up and immediately sign in without email verification
3. **Configure redirect URLs** for your app:
    - For development: `exp://localhost:8081` (or your Expo dev server URL)
    - For production: Your app's custom scheme (e.g., `mealgrade://`)

> **Note**: You can re-enable email confirmations later when you're ready for production.

### 4. Email Configuration (Optional - Skip for Now)

You can skip email configuration for now since we've disabled email confirmations. When you're ready for production, you can:

-   Configure SMTP settings in Supabase
-   Set up custom email templates
-   Re-enable email confirmations

## Testing the Authentication

### 1. Start your app:

```bash
npx expo start
```

### 2. Test the flow:

1. App should redirect to login screen for new users
2. Try creating a new account (no email confirmation needed)
3. User should be immediately signed in after signup
4. Test login with existing credentials
5. **Test session persistence**: Close and reopen the app - user should stay logged in
6. Test password reset functionality (if email is configured)
7. Verify that meal data is user-specific

### 3. Session Persistence Verification:

-   **Close the app completely** (not just minimize)
-   **Reopen the app** - you should see "Loading your session..." briefly
-   **User should remain logged in** and go directly to the main tabs
-   Check the console logs for "Initial session check: User logged in"

## Additional Features You Can Add

### 1. Social Authentication

Add Google, Apple, or other social logins:

```javascript
// In AuthContext.jsx
const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
    });
    return { data, error };
};
```

### 2. Profile Management

Create a dedicated profile editing screen:

-   Update user metadata (name, preferences)
-   Change password
-   Delete account

### 3. Onboarding Flow

Add a welcome/onboarding flow for new users:

-   Collect dietary preferences
-   Set nutrition goals
-   Tutorial walkthrough

### 4. Offline Support

Implement offline authentication state persistence:

-   Cache user session
-   Sync data when back online

## Security Best Practices

1. **Row Level Security (RLS)** - Already implemented in the schema above
2. **Input validation** - Validate all user inputs
3. **Rate limiting** - Configure in Supabase dashboard
4. **Secure storage** - Supabase handles token storage securely

## Troubleshooting

### Common Issues:

1. **"User not authenticated" errors**

    - Check if user is logged in before making API calls
    - Verify Supabase configuration

2. **Email not sending**

    - Check SMTP configuration in Supabase
    - Verify email templates are set up

3. **Redirect issues**

    - Ensure redirect URLs are configured correctly
    - Check app scheme configuration

4. **Database permission errors**
    - Verify RLS policies are set up correctly
    - Check user_id columns exist and are populated

## Next Steps

1. Run the database migrations above
2. **Disable email confirmation in Supabase dashboard** (for easier testing)
3. Test the complete authentication flow
4. Consider adding social authentication
5. Implement user profile management features

Your authentication system is now ready to use! Users can sign up, log in, and their meal data will be private and secure.
