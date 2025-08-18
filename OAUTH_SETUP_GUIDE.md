# OAuth Setup Guide for BrokerAnalysis Platform

This guide walks you through setting up Google and Facebook OAuth authentication for the BrokerAnalysis platform.

## Prerequisites

- Supabase project with authentication enabled
- Google Cloud Console account
- Facebook Developer account
- Domain or localhost for testing

## Step 1: Supabase OAuth Configuration

### 1.1 Enable OAuth Providers in Supabase

1. Open your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Enable **Google** and **Facebook** providers
4. Configure redirect URLs:
   - Development: `http://localhost:5173/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

### 1.2 Configure Site URL

1. Go to **Authentication** > **Settings**
2. Set **Site URL** to your domain:
   - Development: `http://localhost:5173`
   - Production: `https://yourdomain.com`
3. Add **Redirect URLs**:
   - `http://localhost:5173/auth/callback`
   - `https://yourdomain.com/auth/callback`

## Step 2: Google OAuth Setup

### 2.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API** and **OAuth2 API**

### 2.2 Configure OAuth Consent Screen

1. Navigate to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type
3. Fill in required information:
   - **App name**: BrokerAnalysis
   - **User support email**: your-email@domain.com
   - **Developer contact information**: your-email@domain.com
4. Add scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
5. Save and continue

### 2.3 Create OAuth Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Configure:
   - **Name**: BrokerAnalysis Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:5173`
     - `https://yourdomain.com`
   - **Authorized redirect URIs**:
     - `https://diykotyhjwcwdscozltq.supabase.co/auth/v1/callback`
5. Save and copy the **Client ID** and **Client Secret**

### 2.4 Update Supabase Google Settings

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. Click on **Google**
3. Enable the provider
4. Enter your **Client ID** and **Client Secret**
5. Save configuration

## Step 3: Facebook OAuth Setup

### 3.1 Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **Create App**
3. Choose **Consumer** app type
4. Fill in app details:
   - **App name**: BrokerAnalysis
   - **Contact email**: your-email@domain.com
5. Create the app

### 3.2 Configure Facebook Login

1. In your Facebook app dashboard, click **Add Product**
2. Find **Facebook Login** and click **Set Up**
3. Choose **Web** platform
4. Enter your site URL: `http://localhost:5173` (for development)
5. Go to **Facebook Login** > **Settings**
6. Add **Valid OAuth Redirect URIs**:
   - `https://diykotyhjwcwdscozltq.supabase.co/auth/v1/callback`
7. Save changes

### 3.3 Get App Credentials

1. Go to **Settings** > **Basic**
2. Copy your **App ID** and **App Secret**
3. Add your domain to **App Domains**:
   - `localhost` (for development)
   - `yourdomain.com` (for production)

### 3.4 Update Supabase Facebook Settings

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. Click on **Facebook**
3. Enable the provider
4. Enter your **App ID** and **App Secret**
5. Save configuration

## Step 4: Environment Variables

### 4.1 Update .env File

Add the following to your `.env` file:

```env
# OAuth Configuration
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_actual_google_client_secret

# Facebook OAuth
VITE_FACEBOOK_APP_ID=your_actual_facebook_app_id
VITE_FACEBOOK_APP_SECRET=your_actual_facebook_app_secret

# OAuth Redirect URLs
VITE_OAUTH_REDIRECT_URL=http://localhost:5173/auth/callback
VITE_OAUTH_REDIRECT_URL_PROD=https://yourdomain.com/auth/callback
```

### 4.2 Production Environment

For production deployment, update:

1. **Google Cloud Console**:
   - Add production domain to authorized origins
   - Add production redirect URI

2. **Facebook App**:
   - Add production domain to app domains
   - Update redirect URIs for production

3. **Supabase**:
   - Update site URL to production domain
   - Add production redirect URLs

## Step 5: Testing OAuth Integration

### 5.1 Test Google OAuth

1. Start your development server: `npm run dev`
2. Navigate to the login page
3. Click "Sign in with Google"
4. Complete the OAuth flow
5. Verify user is redirected to `/auth/callback`
6. Check that user session is created in Supabase

### 5.2 Test Facebook OAuth

1. Click "Sign in with Facebook"
2. Complete the OAuth flow
3. Verify user is redirected to `/auth/callback`
4. Check that user session is created in Supabase

## Step 6: Security Considerations

### 6.1 Environment Security

- Never commit OAuth secrets to version control
- Use different credentials for development and production
- Regularly rotate OAuth secrets
- Monitor OAuth usage in provider dashboards

### 6.2 Supabase Security

- Enable Row Level Security (RLS) on user tables
- Configure proper user roles and permissions
- Monitor authentication logs
- Set up rate limiting for auth endpoints

## Troubleshooting

### Common Issues

#### Google OAuth Errors

- **"redirect_uri_mismatch"**: Check authorized redirect URIs in Google Console
- **"invalid_client"**: Verify Client ID and Secret are correct
- **"access_denied"**: Check OAuth consent screen configuration

#### Facebook OAuth Errors

- **"invalid_redirect_uri"**: Verify redirect URIs in Facebook app settings
- **"app_not_setup"**: Complete Facebook Login product setup
- **"invalid_scope"**: Check requested permissions in app review

#### Supabase Integration Issues

- **Session not created**: Check Supabase provider configuration
- **Redirect loop**: Verify site URL and redirect URL settings
- **CORS errors**: Check allowed origins in Supabase settings

### Debug Steps

1. **Check Browser Console**: Look for JavaScript errors
2. **Verify Network Requests**: Check OAuth redirect flows
3. **Supabase Logs**: Monitor authentication events
4. **Provider Dashboards**: Check OAuth usage and errors

## Next Steps

1. **User Profile Enhancement**: Collect additional user information
2. **Social Login Analytics**: Track OAuth conversion rates
3. **Multi-Factor Authentication**: Add additional security layers
4. **Account Linking**: Allow users to link multiple OAuth providers

## Support Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)

---

**Note**: This setup enables secure OAuth authentication for the BrokerAnalysis platform. Always follow security best practices and keep credentials secure.