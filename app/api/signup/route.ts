import { addUser } from '@/lib/sheets';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, name, email, phone, location, address } = body;

        if (!userId || !name || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await addUser({ userId, name, email, phone, location, address });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Signup error - Full details:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        return NextResponse.json({ error: error.message || 'Signup failed' }, { status: 500 });
    }
}
