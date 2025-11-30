# Your GPT

AI Chat Application with User Management and Activity Logging

## Features

- 🤖 Local AI Chat powered by Ollama
- 👥 User Management with Admin Approval
- 📊 Activity Logging to Google Sheets
- 🎨 Beautiful Modern UI
- 🔐 Secure Authentication

## Tech Stack

- Next.js 13
- React 18
- Tailwind CSS
- Google Sheets API
- Ollama (Local AI)

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local`:
   ```
   OLLAMA_BASE_URL=http://localhost:11434/api
   GOOGLE_SHEET_ID=your_sheet_id
   OLLAMA_MODEL=llama3.2:3b
   ```

3. Add `service-account.json` to project root

4. Run development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Environment Variables

- `OLLAMA_BASE_URL` - Ollama API endpoint
- `GOOGLE_SHEET_ID` - Google Sheet ID for user data
- `OLLAMA_MODEL` - AI model to use (default: llama3.2:3b)
- `GOOGLE_SERVICE_ACCOUNT_CREDENTIALS` - Service account JSON (for Vercel)

## License

MIT
