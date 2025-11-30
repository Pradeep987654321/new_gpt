const { GoogleSpreadsheet } = require('google-spreadsheet');
const credentials = require('./service-account.json');

const SHEET_ID = '1c2js8--JqsjCozHXGIOZiJNasQtKebOJE86-dRQX9iQ';

async function test() {
    console.log('Testing connection to Sheet:', SHEET_ID);
    console.log('Using email:', credentials.client_email);

    const doc = new GoogleSpreadsheet(SHEET_ID);

    try {
        await doc.useServiceAccountAuth({
            client_email: credentials.client_email,
            private_key: credentials.private_key,
        });
        await doc.loadInfo();
        console.log('SUCCESS! Sheet title:', doc.title);
    } catch (e) {
        console.error('ERROR:', e.message);
    }
}

test();
