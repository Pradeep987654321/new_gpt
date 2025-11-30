# Deployment Guide: Your GPT to Vercel

## 🚀 Prerequisites

1. **GitHub Account** - Create one at https://github.com if you don't have it
2. **Vercel Account** - Sign up at https://vercel.com (use your GitHub account)
3. **Ngrok Account** - Sign up at https://ngrok.com (for exposing local Ollama)

## 📦 Step 1: Prepare Your Code

### Clean up files (already done for you):
- Remove `test-sheets.js` and `test-ollama.js`
- Ensure `.gitignore` includes sensitive files

### Important Files to Keep Secret:
- `.env.local` - DO NOT commit this
- `service-account.json` - DO NOT commit this

## 🔧 Step 2: Initialize Git Repository

```bash
cd C:\Users\visionary\.gemini\antigravity\scratch\ollama-gpt
git init
git add .
git commit -m "Initial commit: Your GPT application"
```

## 🌐 Step 3: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `your-gpt`
3. Description: "AI Chat Application with User Management"
4. Keep it **Private** (recommended)
5. Click "Create repository"

## 📤 Step 4: Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/your-gpt.git
git branch -M main
git push -u origin main
```

## 🚇 Step 5: Setup Ngrok (Expose Local Ollama)

Since Ollama runs locally, you need to expose it to the internet:

1. Install Ngrok: https://ngrok.com/download
2. Sign up and get your auth token
3. Run these commands:
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ngrok http 11434
   ```
4. Copy the forwarding URL (e.g., `https://abc123.ngrok-free.app`)

## ☁️ Step 6: Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure Project:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add Environment Variables** (CRITICAL):
   Click "Environment Variables" and add:

   ```
   OLLAMA_BASE_URL=https://YOUR_NGROK_URL/api
   GOOGLE_SHEET_ID=1c2js8--JqsjCozHXGIOZiJNasQtKebOJE86-dRQX9iQ
   OLLAMA_MODEL=llama3.2:3b
   GOOGLE_SERVICE_ACCOUNT_CREDENTIALS=<paste entire service-account.json content>
   ```

5. Click **Deploy**

## 🔐 Step 7: Update Code for Vercel

You need to modify `lib/sheets.ts` to read credentials from environment variable instead of file (since you can't upload `service-account.json` to Vercel).

## ⚠️ Important Notes

### Ngrok Limitations:
- Free tier: URL changes every restart
- You'll need to update `OLLAMA_BASE_URL` in Vercel each time Ngrok restarts
- Consider Ngrok paid plan for static domain

### Alternative: Deploy Ollama to Cloud
- Use Modal.com, Replicate, or RunPod for cloud-hosted Ollama
- More reliable than Ngrok tunnel

### Google Sheets Access:
- Make sure your service account has access to the sheet
- The sheet must remain accessible

## 🎯 Next Steps After Deployment

1. Test signup at `https://your-app.vercel.app/signup`
2. Approve user in Google Sheets
3. Test login and chat
4. Monitor logs in Vercel dashboard

## 🐛 Troubleshooting

- **Build fails**: Check Node.js version in Vercel settings
- **Ollama not responding**: Check Ngrok tunnel is active
- **Sheets error**: Verify service account credentials in env vars
- **404 errors**: Ensure all environment variables are set

## 📝 Maintenance

- Keep Ngrok running on your local machine
- Monitor Google Sheets for new user approvals
- Check Vercel logs for errors
