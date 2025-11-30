import { GoogleSpreadsheet } from 'google-spreadsheet';

// Load credentials from environment or file
let credentials: any;
if (process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) {
    // Vercel: Read from environment variable
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
} else {
    // Local: Read from file
    credentials = require('../service-account.json');
}

export async function initSheet() {
    // Try multiple ways to get the Sheet ID
    const SHEET_ID = process.env.GOOGLE_SHEET_ID ||
        process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID ||
        '1c2js8--JqsjCozHXGIOZiJNasQtKebOJE86-dRQX9iQ';

    console.log('Initializing Sheet with ID:', SHEET_ID);
    console.log('All env vars:', Object.keys(process.env).filter(k => k.includes('GOOGLE')));

    if (!SHEET_ID) {
        throw new Error('GOOGLE_SHEET_ID environment variable is not set');
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
    const exists = rows.find((row) => row.UserID === user.userId);
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
    const userRow = rows.find((row) => row.UserID === userId);

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
