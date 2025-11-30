# Connect Vercel to GitHub for Automatic Deployments

## Step-by-Step Guide

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Login if needed

2. **Open Your Project**
   - Click on your `admin_panal` project

3. **Go to Settings**
   - Click on **"Settings"** tab (top navigation)

4. **Connect Git Repository**
   - Scroll down to **"Git"** section
   - Click **"Connect Git Repository"** button
   - Select **GitHub** as your Git provider
   - Authorize Vercel to access your GitHub account (if first time)
   - Search for your repository: `vishdadhich092004/minor-proj`
   - Click **"Connect"**

5. **Configure Build Settings**
   - **Root Directory:** Set to `admin_panal` (since your Flutter app is in a subdirectory)
   - **Framework Preset:** Other
   - **Build Command:** `flutter build web --release`
   - **Output Directory:** `build/web`
   - **Install Command:** (leave empty or add Flutter setup if needed)

6. **Save and Deploy**
   - Click **"Save"**
   - Vercel will automatically trigger a new deployment

### Method 2: Via Vercel CLI

If you prefer CLI, run these commands:

```bash
cd admin_panal
vercel git connect --yes
```

Then configure the build settings in the dashboard.

## Important Configuration

After connecting, make sure these settings are correct in Vercel Dashboard → Settings → General:

- **Root Directory:** `admin_panal`
- **Build Command:** `flutter build web --release`
- **Output Directory:** `build/web`
- **Install Command:** (empty or add Flutter installation)

## Automatic Deployments

Once connected:
- ✅ Every push to `main` branch = Automatic production deployment
- ✅ Every pull request = Preview deployment
- ✅ You can see deployment status in GitHub

## Update vercel.json for Git Deployments

Since we're deploying from Git, we need to update the root `vercel.json`:

The `vercel.json` in `admin_panal/` should have:
```json
{
  "buildCommand": "flutter build web --release",
  "outputDirectory": "build/web",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Troubleshooting

### Issue: Build fails with "flutter: command not found"
- Vercel doesn't have Flutter installed by default
- You need to either:
  1. Use a build script that installs Flutter
  2. Or build locally and commit the `build/web` folder (not recommended)

### Issue: Can't find Root Directory
- Make sure you set Root Directory to `admin_panal` in project settings
- This tells Vercel where your Flutter project is located

### Issue: 404 errors after Git deployment
- Make sure `vercel.json` is in the `admin_panal/` directory (root of your Flutter project)
- The rewrite rules must be present

## Recommended: Use GitHub Actions (Alternative)

If Vercel's build fails (Flutter not available), you can:
1. Build locally or via GitHub Actions
2. Commit the `build/web` folder
3. Deploy from Git (Vercel will use pre-built files)

But for now, let's try connecting via dashboard first!

