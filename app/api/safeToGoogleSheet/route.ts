import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
    try {
        const { deployer, contract, network } = await request.json();

        const auth = new google.auth.GoogleAuth({
            credentials: {
              client_email: process.env.GOOGLE_CLIENT_EMAIL,
              private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: "v4", auth });
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;
        const range = "Sheet1!A:D";

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: "RAW",
            requestBody: {
                values: [[deployer, contract, network, new Date().toISOString()]],
            },
        });

        return NextResponse.json({ message: 'Data saved to Google Sheets' });
    } catch (error) {
        console.error('Error saving to Google Sheets:', error);
        return NextResponse.json({ message: 'Failed to save data to Google Sheets' }, { status: 500 });
    }
}
