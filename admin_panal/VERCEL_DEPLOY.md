# Deploy Admin Panel to Vercel

## Quick Deploy Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Navigate to admin_panal directory:**
   ```bash
   cd admin_panal
   ```

4. **Build the Flutter web app:**
   ```bash
   flutter build web --release
   ```

5. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```
   
   When prompted:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No** (for first time)
   - Project name? (Press Enter for default or type custom name)
   - Directory? **build/web** (or just press Enter if vercel.json is configured)
   - Override settings? **No**

6. **Your app will be live!** Vercel will provide you with a URL like:
   `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel Dashboard (Easiest)

1. **Build the app first:**
   ```bash
   cd admin_panal
   flutter build web --release
   ```

2. **Go to [vercel.com](https://vercel.com)** and sign up/login

3. **Click "Add New Project"**

4. **Import your Git repository** (if you have it on GitHub/GitLab/Bitbucket)
   - Connect your repository
   - Vercel will auto-detect settings
   - Build Command: `cd admin_panal && flutter build web --release`
   - Output Directory: `admin_panal/build/web`
   - Install Command: (leave empty or add Flutter setup if needed)

5. **Or drag and drop the `build/web` folder:**
   - Go to Vercel Dashboard
   - Click "Add New Project"
   - Drag and drop the `admin_panal/build/web` folder
   - Deploy!

### Option 3: Deploy via Git Integration (Best for Updates)

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Go to Vercel Dashboard** → "Add New Project"

3. **Import your repository**

4. **Configure build settings:**
   - **Framework Preset:** Other
   - **Root Directory:** `admin_panal` (if repo root) or leave empty
   - **Build Command:** `flutter build web --release`
   - **Output Directory:** `build/web`
   - **Install Command:** (leave empty or add Flutter setup)

5. **Add Environment Variables** (if needed):
   - Go to Project Settings → Environment Variables
   - Add any API URLs or keys your app needs

6. **Deploy!** Vercel will automatically deploy on every push to your main branch.

## Important Notes

### For Git Integration:
If deploying from Git, you may need to add a `vercel.json` in the root or configure build settings:

```json
{
  "buildCommand": "cd admin_panal && flutter build web --release",
  "outputDirectory": "admin_panal/build/web"
}
```

### Environment Variables:
If your admin panel uses API endpoints, update them in:
- Vercel Dashboard → Project Settings → Environment Variables
- Or update `lib/services/http_services.dart` to use environment variables

### Custom Domain:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Troubleshooting

### Issue: Build fails
- Ensure Flutter is installed on Vercel's build environment
- You may need to add Flutter installation in build settings
- Check build logs in Vercel dashboard

### Issue: Blank page after deployment
- Check browser console for errors
- Verify all assets are included
- Check if API calls are working (CORS issues)

### Issue: Routing not working
- Ensure `vercel.json` has the rewrite rule for SPA routing
- Check that `index.html` has correct base href

## Quick Deploy Script

Create a file `deploy-vercel.sh`:

```bash
#!/bin/bash
echo "Building Flutter web app..."
flutter build web --release

echo "Deploying to Vercel..."
vercel --prod

echo "Deployment complete!"
```

Make it executable:
```bash
chmod +x deploy-vercel.sh
```

Run it:
```bash
./deploy-vercel.sh
```

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Flutter Web: https://docs.flutter.dev/deployment/web

