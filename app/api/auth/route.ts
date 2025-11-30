import { getUserStatus } from '@/lib/sheets';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'UserID required' }, { status: 400 });
        }

        const status = await getUserStatus(userId);

        if (!status) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (status !== 'Accepted') {
            return NextResponse.json({ error: 'Account pending approval', status }, { status: 403 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Auth error:', error);
        return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
    }
}
