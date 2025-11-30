import { GoogleSpreadsheet } from 'google-spreadsheet';
import fs from 'fs';
import path from 'path';

// Load credentials from environment or file
function getCredentials() {
    if (process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) {
        // Vercel: Read from environment variable
        try {
            return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
        } catch (e) {
            console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_CREDENTIALS', e);
            return null;
        }
    } else {
        // Local: Try to read from file using fs to avoid Webpack bundling issues
        try {
            const filePath = path.join(process.cwd(), 'service-account.json');
            if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                return JSON.parse(fileContent);
            }
        } catch (e) {
            console.warn('Local service-account.json not found or unreadable.');
        }
        return null;
    }
}

export async function initSheet() {
    const credentials = getCredentials();

    // Try multiple ways to get the Sheet ID
    const SHEET_ID = process.env.GOOGLE_SHEET_ID ||
        process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID ||
        '1c2js8--JqsjCozHXGIOZiJNasQtKebOJE86-dRQX9iQ';

    console.log('Initializing Sheet with ID:', SHEET_ID);

    if (!SHEET_ID) {
        throw new Error('GOOGLE_SHEET_ID environment variable is not set');
    }

    if (!credentials) {
        throw new Error('Google Service Account credentials not found. Set GOOGLE_SERVICE_ACCOUNT_CREDENTIALS env var or add service-account.json locally.');
    }

    const doc = new GoogleSpreadsheet(SHEET_ID);

    try {
        await doc.useServiceAccountAuth({
            client_email: credentials.client_email,
            private_key: credentials.private_key,
        });
        await doc.loadInfo();
        console.log('Sheet loaded successfully:', doc.title);
        return doc;
    } catch (e) {
        console.error('Failed to load sheet:', e);
        throw e;
    }
}

export async function addUser(user: {
    userId: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    address: string;
}) {
    console.log('addUser called with:', user);
    const doc = await initSheet();
    console.log('Sheet initialized, looking for Users sheet...');
    const sheet = doc.sheetsByTitle['Users'];

    console.log('Available sheets:', Object.keys(doc.sheetsByTitle));

    if (!sheet) {
        throw new Error('Users sheet not found');
    }

    console.log('Users sheet found, getting rows...');
    const rows = await sheet.getRows();
    console.log('Got rows, checking for existing user...');
    const exists = rows.find((row: any) => row.UserID === user.userId);
    if (exists) {
        throw new Error('User ID already exists');
    }

    console.log('Adding new row...');
    await sheet.addRow({
        UserID: user.userId,
        Name: user.name,
        Email: user.email,
        Phone: user.phone,
        Location: user.location,
        Address: user.address,
        Status: 'Pending',
        CreatedAt: new Date().toISOString(),
    });
    console.log('Row added successfully!');
}

export async function getUserStatus(userId: string) {
    const doc = await initSheet();
    const sheet = doc.sheetsByTitle['Users'];
    if (!sheet) return null;

    const rows = await sheet.getRows();
    const userRow = rows.find((row: any) => row.UserID === userId);

    if (!userRow) return null;
    return userRow.Status;
}

export async function logActivity(log: {
    userId: string;
    model: string;
    prompt: string;
    response: string;
}) {
    const doc = await initSheet();
    let sheet = doc.sheetsByTitle['Logs'];
    if (!sheet) {
        sheet = await doc.addSheet({ title: 'Logs', headerValues: ['Timestamp', 'UserID', 'Model', 'Prompt', 'Response'] });
    }

    await sheet.addRow({
        Timestamp: new Date().toISOString(),
        UserID: log.userId,
        Model: log.model,
        Prompt: log.prompt,
        Response: log.response,
    });
}
