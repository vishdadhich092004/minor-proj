# MongoDB Atlas Setup for Serverless Deployment

## Common Issue: Connection Timeout

If you're getting `MongoServerSelectionError: Server selection timed out` or `Could not connect to any servers in your MongoDB Atlas cluster`, this is usually due to IP whitelist restrictions.

## Solution 1: Allow All IPs (Recommended for Development/Serverless)

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
2. Navigate to your cluster
3. Click **"Network Access"** in the left sidebar
4. Click **"Add IP Address"**
5. Click **"Allow Access from Anywhere"** or enter `0.0.0.0/0`
6. Click **"Confirm"**

⚠️ **Security Note:** `0.0.0.0/0` allows access from any IP. For production, consider:
- Using MongoDB Atlas VPC Peering
- Using specific IP ranges if your serverless provider supports it
- Using MongoDB Atlas API Keys with proper authentication

## Solution 2: Use Vercel IP Ranges (Better Security)

If deploying on Vercel, you can whitelist Vercel's IP ranges:

1. Go to MongoDB Atlas Network Access
2. Add IP addresses from Vercel's IP ranges
3. Check [Vercel's documentation](https://vercel.com/docs/security/deployment-protection#ip-ranges) for current IP ranges

## Solution 3: Check Environment Variables

Ensure your `MONGO_URL` environment variable is set correctly:

```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

## Solution 4: Connection String Format

Make sure your connection string includes:
- `retryWrites=true` - Enables retry on write operations
- `w=majority` - Write concern
- Correct username and password (URL encoded if needed)
- Database name at the end

## Testing Connection

After updating IP whitelist, wait 1-2 minutes for changes to propagate, then test your API endpoints.

## Error Messages

- `MongoServerSelectionError` - IP not whitelisted or network issue
- `MongooseServerSelectionError` - Connection timeout (check IP whitelist)
- `Authentication failed` - Wrong username/password
- `bad auth` - Invalid credentials

## Additional Notes for Serverless

- Connections may be cached between function invocations
- Use connection pooling settings (already configured in `index.js`)
- Consider using MongoDB Atlas Serverless Instance for better serverless compatibility

