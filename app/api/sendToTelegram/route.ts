import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { deployer, contract, network } = await request.json();

        const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
        const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
        const message = `Contract deployed!\nDeployer: ${deployer}\nContract: ${contract}\nNetwork: ${network}`;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
            }),
        });

        return NextResponse.json({ message: 'Message sent to Telegram' });
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
        return NextResponse.json({ message: 'Failed to send message to Telegram' }, { status: 500 });
    }
}
