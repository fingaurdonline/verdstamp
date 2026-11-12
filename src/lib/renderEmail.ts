import ResetPassword from "@/app/emails/reset-password";
import VerifyEmail from "@/app/emails/verify-email";
import { render } from "@react-email/render";

interface VerifyEmailProps {
  userName: string;
  verifyUrl: string;
}

interface ResetPasswordProps {
  userName: string;
  resetUrl: string;
}

export const renderVerifyEmail = async ({
  userName,
  verifyUrl,
}: VerifyEmailProps) => {
  return await render(VerifyEmail({ userName, verifyUrl }));
};

export const renderResetPasswordEmail = async ({
  userName,
  resetUrl,
}: ResetPasswordProps) => {
  return await render(ResetPassword({ userName, resetUrl }));
};
