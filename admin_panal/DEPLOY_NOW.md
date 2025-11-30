# Quick Deploy to Vercel - Follow These Steps

## Step-by-Step Instructions

### 1. Login to Vercel (First Time Only)
Open PowerShell/Terminal in the `admin_panal` directory and run:
```bash
vercel login
```
This will open your browser to authenticate with Vercel.

### 2. Deploy Your App
Once logged in, run:
```bash
cd admin_panal
vercel --prod
```

When prompted:
- **Set up and deploy?** → Type `Y` and press Enter
- **Which scope?** → Select your account (usually just press Enter)
- **Link to existing project?** → Type `N` (for first deployment)
- **What's your project's name?** → Press Enter for default or type a custom name
- **In which directory is your code located?** → Type `build/web` or just press Enter (vercel.json handles this)
- **Want to override the settings?** → Type `N`

### 3. Your App is Live! 🎉
Vercel will provide you with a URL like:
`https://your-project-name.vercel.app`

## Alternative: Drag & Drop Method (Easiest)

If you prefer a visual interface:

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Drag and drop the `admin_panal/build/web` folder
4. Click "Deploy"
5. Done! Your app will be live in seconds.

## For Future Updates

After the first deployment, you can update by simply running:
```bash
cd admin_panal
flutter build web --release
vercel --prod
```

Or connect your Git repository to Vercel for automatic deployments on every push!

