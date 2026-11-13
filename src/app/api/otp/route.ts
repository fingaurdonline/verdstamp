import OTPEmail from "@/app/emails/otp";
import { getResend } from "@/lib/resend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    const { data, error } = await getResend().emails.send({
      from: "Verdstamp <team@verdstampdigital.app>",
      to: [email],
      subject: "Your OTP Code",
      react: OTPEmail({ email, code }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
