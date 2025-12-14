# Cloudinary Setup Guide

This project now uses Cloudinary for image storage instead of local file storage. This provides better scalability, CDN delivery, and automatic image optimization.

## Prerequisites

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your Cloudinary credentials from the dashboard

## Installation

1. Install the Cloudinary package:
```bash
cd backend
npm install cloudinary
```

## Environment Variables

Add the following environment variables to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### How to Get Your Credentials

1. Log in to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Go to the Dashboard section
3. You'll see your credentials displayed:
   - **Cloud Name**: Found at the top of the dashboard
   - **API Key**: Listed in the "Account Details" section
   - **API Secret**: Click "Reveal" to show your API secret

## Features

- ✅ Automatic image optimization (WebP format when supported)
- ✅ Quality optimization
- ✅ CDN delivery for faster image loading
- ✅ Scalable cloud storage
- ✅ No local storage required

## Folder Structure in Cloudinary

Images are organized in folders:
- `categories/` - Category images
- `posters/` - Poster images
- `products/` - Product images (when implemented)

## Migration Notes

- Old images stored locally will continue to work if the static file serving is still configured
- New uploads will automatically use Cloudinary
- Image URLs will be Cloudinary URLs (e.g., `https://res.cloudinary.com/your-cloud/image/upload/v1234567890/categories/image.jpg`)

## Testing

After setting up your environment variables:

1. Restart your backend server
2. Try uploading a category image
3. Check the response - the `image` field should contain a Cloudinary URL
4. Verify the image loads correctly in your frontend

## Troubleshooting

### Error: "Invalid API Key"
- Double-check your `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` in `.env`
- Ensure there are no extra spaces or quotes

### Error: "Cloud name not found"
- Verify your `CLOUDINARY_CLOUD_NAME` is correct
- Cloud name is case-sensitive

### Images not uploading
- Check server logs for detailed error messages
- Verify your Cloudinary account is active
- Check file size limits (default is 10MB)

## Benefits Over Local Storage

1. **No Server Storage**: Images are stored in the cloud, not on your server
2. **CDN**: Images are delivered via Cloudinary's CDN for faster loading
3. **Automatic Optimization**: Images are automatically optimized for web
4. **Scalability**: No need to worry about disk space
5. **Transformations**: Easy to resize, crop, or transform images on-the-fly
