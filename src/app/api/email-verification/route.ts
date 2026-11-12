import VerifyEmail from "@/app/emails/verify-email";
import { getResend } from "@/lib/resend";

export async function POST(req: Request) {
  const { username, url, email } = await req.json();
  try {
    const { data, error } = await getResend().emails.send({
      from: "Verdstamp <team@coinmaidenhub.com>",
      to: email,
      subject: "Email Verification",
      react: VerifyEmail({
        userName: username,
        verifyUrl: url,
      }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
