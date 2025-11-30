# Admin Panel Web Deployment Guide

This guide will help you deploy your Flutter admin panel to various hosting platforms.

## Prerequisites

1. Build the web version of your Flutter app
2. Choose a hosting platform
3. Deploy the built files

## Step 1: Build the Web App

Run the following command in the `admin_panal` directory:

```bash
flutter build web --release
```

This will create optimized web files in `admin_panal/build/web/` directory.

## Deployment Options

### Option 1: Firebase Hosting (Recommended - Free & Easy)

**Pros:** Free, easy setup, CDN included, custom domain support

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project:**
   ```bash
   cd admin_panal
   firebase init hosting
   ```
   - Select "Use an existing project" or create a new one
   - Set public directory to: `build/web`
   - Configure as single-page app: **Yes**
   - Set up automatic builds: **No** (or Yes if you want CI/CD)

4. **Deploy:**
   ```bash
   flutter build web --release
   firebase deploy --only hosting
   ```

5. Your app will be live at: `https://YOUR-PROJECT-ID.web.app`

### Option 2: Netlify (Free & Easy)

**Pros:** Free, drag-and-drop deployment, continuous deployment from Git

1. **Build the app:**
   ```bash
   flutter build web --release
   ```

2. **Deploy via Netlify Dashboard:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login
   - Drag and drop the `build/web` folder to Netlify
   - Your app will be live instantly!

3. **Deploy via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=build/web
   ```

### Option 3: Vercel (Free & Fast)

**Pros:** Free, excellent performance, easy Git integration

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd admin_panal
   flutter build web --release
   cd build/web
   vercel --prod
   ```

### Option 4: GitHub Pages (Free)

**Pros:** Free, integrated with GitHub

1. **Build the app:**
   ```bash
   flutter build web --release --base-href "/YOUR-REPO-NAME/"
   ```

2. **Create a GitHub Actions workflow** (`.github/workflows/deploy.yml`):
   ```yaml
   name: Deploy Flutter Web to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: subosito/flutter-action@v2
           with:
             flutter-version: '3.24.0'
         - run: flutter pub get
         - run: flutter build web --release --base-href "/YOUR-REPO-NAME/"
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./build/web
   ```

### Option 5: AWS Amplify (Free Tier Available)

**Pros:** Scalable, integrated with AWS services

1. Go to AWS Amplify Console
2. Connect your Git repository
3. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - cd admin_panal
           - flutter pub get
       build:
         commands:
           - flutter build web --release
     artifacts:
       baseDirectory: admin_panal/build/web
       files:
         - '**/*'
     cache:
       paths:
         - admin_panal/.dart_tool
   ```

## Important Configuration Notes

### Base URL Configuration

If deploying to a subdirectory (like GitHub Pages), update `web/index.html`:

```html
<base href="/YOUR-REPO-NAME/">
```

Or build with:
```bash
flutter build web --release --base-href "/YOUR-REPO-NAME/"
```

### CORS Configuration

If your admin panel makes API calls to a backend, ensure:
1. Your backend allows CORS from your domain
2. Update API endpoints in your code to use the production URL

### Environment Variables

For different environments, consider using:
- `.env` files for local development
- Environment variables in your hosting platform
- Update API URLs in `lib/services/http_services.dart`

## Quick Start (Firebase - Recommended)

```bash
# 1. Build
cd admin_panal
flutter build web --release

# 2. Install Firebase CLI
npm install -g firebase-tools

# 3. Login
firebase login

# 4. Initialize (first time only)
firebase init hosting
# Select: build/web as public directory
# Configure as single-page app: Yes

# 5. Deploy
firebase deploy --only hosting
```

## Troubleshooting

### Issue: Blank page after deployment
- Check browser console for errors
- Verify base href is correct
- Ensure all assets are included in build

### Issue: API calls failing
- Check CORS settings on backend
- Verify API URLs are correct for production
- Check network tab in browser DevTools

### Issue: Routing not working
- Ensure hosting is configured for single-page app
- Check base href configuration
- Verify all routes are handled correctly

## Security Considerations

1. **Authentication:** Ensure your admin panel has proper authentication
2. **HTTPS:** Always use HTTPS in production
3. **API Keys:** Never commit API keys or secrets to Git
4. **Environment Variables:** Use environment variables for sensitive data

## Need Help?

- Flutter Web: https://docs.flutter.dev/deployment/web
- Firebase Hosting: https://firebase.google.com/docs/hosting
- Netlify: https://docs.netlify.com

