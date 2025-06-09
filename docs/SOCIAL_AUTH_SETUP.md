# Social Authentication Setup Guide

## Overview

Your Nutricado app now supports social sign-in with Google, Apple, and Facebook through Supabase Auth. This guide will walk you through the setup process for each provider.

## Prerequisites

-   Supabase project with authentication enabled
-   Developer accounts for each provider you want to integrate
-   Your app's redirect URI scheme configured

## App Configuration

### 1. Redirect URI Setup

Your app uses the scheme `nutricado://` for OAuth redirects. Make sure this is consistent across all configurations.

For development, the redirect URI will be: `nutricado://auth/callback`
For production, use the same scheme with your published app.

## Provider Setup

### Google Sign-In

#### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** (if not already enabled)

#### 2. Create OAuth 2.0 Credentials

1. Go to **APIs & Services > Credentials**
2. Click **+ CREATE CREDENTIALS > OAuth 2.0 Client IDs**
3. Create credentials for both iOS and Android:

**For iOS:**

-   Application type: `iOS`
-   Bundle ID: `com.nutricado.app` (from your app.config.js)

**For Android:**

-   Application type: `Android`
-   Package name: `com.nutricado.app`
-   SHA-1 certificate fingerprint: Get this by running:

    ```bash
    # For development
    cd android/app
    keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

    # For production (when you have your release keystore)
    keytool -list -v -keystore your-release-key.keystore -alias your-key-alias
    ```

#### 3. Configure in Supabase

1. In your Supabase dashboard, go to **Authentication > Providers**
2. Enable **Google**
3. Add your Client ID and Client Secret from Google Cloud Console
4. Set redirect URL to: `https://your-project-ref.supabase.co/auth/v1/callback`

### Apple Sign-In

#### 1. Apple Developer Account Setup

1. Go to [Apple Developer Console](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles**

#### 2. Create App ID

1. Go to **Identifiers > App IDs**
2. Click **+** to create new App ID
3. Select **App** and click **Continue**
4. Fill in:
    - Description: `Nutricado App`
    - Bundle ID: `com.nutricado.app`
5. Under **Capabilities**, enable **Sign In with Apple**
6. Click **Continue** and **Register**

#### 3. Create Services ID

1. Go to **Identifiers > Services IDs**
2. Click **+** to create new Services ID
3. Fill in:
    - Description: `Nutricado Web Service`
    - Identifier: `com.nutricado.service` (must be different from app ID)
4. Enable **Sign In with Apple**
5. Click **Configure** next to Sign In with Apple
6. Add your domain and redirect URL:
    - Domain: `your-project-ref.supabase.co`
    - Redirect URL: `https://your-project-ref.supabase.co/auth/v1/callback`

#### 4. Create Private Key

1. Go to **Keys**
2. Click **+** to create new key
3. Fill in:
    - Key Name: `Nutricado Apple Sign In Key`
    - Enable **Sign In with Apple**
4. Click **Configure** and select your App ID
5. Download the private key file (you can only download once!)

#### 5. Configure in Supabase

1. In Supabase dashboard, go to **Authentication > Providers**
2. Enable **Apple**
3. Fill in:
    - Client ID: Your Services ID (e.g., `com.nutricado.service`)
    - Client Secret: Generate using the private key (see Apple documentation)
    - Team ID: Your Apple Developer Team ID
    - Key ID: From the private key you created

### Facebook Login

#### 1. Facebook Developers Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use existing one
3. Add **Facebook Login** product to your app

#### 2. Configure Facebook Login

1. In Facebook Login settings, add these redirect URIs:
    - `https://your-project-ref.supabase.co/auth/v1/callback`
2. Under **App Domains**, add: `your-project-ref.supabase.co`

#### 3. Get App Credentials

1. Go to **Settings > Basic**
2. Copy your **App ID** and **App Secret**

#### 4. Configure Platform Settings

**For iOS:**

1. Go to **Settings > Platforms**
2. Add **iOS** platform
3. Bundle ID: `com.nutricado.app`

**For Android:**

1. Add **Android** platform
2. Package Name: `com.nutricado.app`
3. Class Name: `com.nutricado.MainActivity`
4. Key Hashes: Generate using:
    ```bash
    # Development key hash
    keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
    ```

#### 5. Configure in Supabase

1. In Supabase dashboard, go to **Authentication > Providers**
2. Enable **Facebook**
3. Add your App ID and App Secret
4. Set redirect URL to: `https://your-project-ref.supabase.co/auth/v1/callback`

## Testing the Integration

### 1. Start Your Development Server

```bash
npx expo start
```

### 2. Test Each Provider

1. **Google**: Should open Google's OAuth page in browser
2. **Apple**: Should show Apple ID sign-in (iOS only)
3. **Facebook**: Should open Facebook's OAuth page

### 3. Verify User Data

After successful authentication, check that:

-   User is redirected to main app
-   User data is properly stored in Supabase
-   Session persistence works on app reload

## Troubleshooting

### Common Issues

#### Google Sign-In

-   **Error: invalid_client**: Check your Client ID and ensure SHA-1 fingerprint is correct
-   **Error: redirect_uri_mismatch**: Verify redirect URI in Google Console matches Supabase

#### Apple Sign-In

-   **Invalid client**: Check Services ID and ensure it's different from App ID
-   **Invalid redirect URI**: Verify domain and redirect URL in Services ID configuration

#### Facebook Login

-   **App Not Setup**: Complete Facebook app review process
-   **Invalid redirect URI**: Check that redirect URI is added to Facebook Login settings

### General Debugging

1. **Check Supabase logs**: Authentication > Logs
2. **Verify redirect URIs**: Must match exactly between provider and Supabase
3. **Test on device**: Some social logins don't work in simulators
4. **Check network connectivity**: Ensure device can reach OAuth endpoints

## Production Deployment

### Before Going Live

1. **Apple**: Submit app for App Store review (required for Apple Sign-In)
2. **Facebook**: Submit app for Facebook review if using advanced permissions
3. **Google**: Update production SHA-1 fingerprints
4. **Update redirect URIs** for production domains

### Security Considerations

1. **Keep secrets secure**: Never commit OAuth secrets to version control
2. **Use environment variables**: Store credentials in secure environment
3. **Validate tokens**: Supabase handles this, but ensure proper error handling
4. **Monitor usage**: Set up logging for authentication attempts

## Additional Features

### Custom Scopes

You can request additional permissions by modifying the OAuth calls in `AuthContext.jsx`:

```javascript
const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
        redirectTo,
        skipBrowserRedirect: true,
        scopes: "email profile openid", // Add custom scopes
    },
});
```

### Profile Data Handling

Social providers return different user data structures. Handle this in your profile screens:

```javascript
const getDisplayName = (user) => {
    return (
        user.user_metadata?.name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "User"
    );
};
```

## Support

-   **Supabase Auth**: [Documentation](https://supabase.com/docs/guides/auth)
-   **Google OAuth**: [Documentation](https://developers.google.com/identity/protocols/oauth2)
-   **Apple Sign-In**: [Documentation](https://developer.apple.com/sign-in-with-apple/)
-   **Facebook Login**: [Documentation](https://developers.facebook.com/docs/facebook-login/)

Your social authentication is now ready to use! Users can sign up and log in using their preferred social accounts.
