import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    // Supabase Hooks send the data inside an 'sms' object
    const { sms: { phone, otp } } = body;

    // 1. Verify Authorization from Supabase
    const authHeader = request.headers.get('authorization');
    const secret = process.env.SUPABASE_SMS_HOOK_SECRET;

    if (!authHeader || authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Format the message
    const message = `${otp} is your StayEase OTP. Valid for 10 minutes. Do not share. - StayEase`;

    // 3. Call MSG91 API
    const response = await fetch('https://api.msg91.com/api/v2/sendsms', {
      method: 'POST',
      headers: {
        'authkey': process.env.MSG91_AUTH_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: process.env.MSG91_SENDER_ID || 'MSGIND',
        route: '4', // Transactional route
        country: '91',
        sms: [{
          message: message,
          to: [phone.replace('+91', '')],
          // IMPORTANT: Indian SMS requires a Template ID (DLT)
          // template_id: "YOUR_TEMPLATE_ID_HERE" 
        }]
      })
    });

    if (response.ok) {
      return NextResponse.json({ message: 'OTP sent' });
    } else {
      const errorData = await response.text();
      console.error('MSG91 Error:', errorData);
      return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
    }
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
