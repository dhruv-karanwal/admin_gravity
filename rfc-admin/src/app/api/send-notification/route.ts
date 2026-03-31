import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT || '{}');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (error) {
        console.error('Firebase Admin Initialization Error:', error);
    }
}

export async function POST(request: Request) {
    try {
        const { title, message, target, token } = await request.json();

        if (!title || !message || !target) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const payload: any = {
            notification: {
                title,
                body: message,
            },
            data: {
                click_action: 'FLUTTER_NOTIFICATION_CLICK',
            },
        };

        let response;
        if (target === 'topic') {
            response = await admin.messaging().send({
                ...payload,
                topic: 'all_users'
            });
        } else if (target === 'single' && token) {
            response = await admin.messaging().send({
                ...payload,
                token: token
            });
        } else {
            return NextResponse.json({ error: 'Invalid target or missing token' }, { status: 400 });
        }

        // Log the notification
        const db = admin.firestore();
        await db.collection('notification_logs').add({
            title,
            message,
            target,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            status: 'sent',
            responseId: response
        });

        return NextResponse.json({ success: true, response });
    } catch (error: any) {
        console.error('FCM Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
