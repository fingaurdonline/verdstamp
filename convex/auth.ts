import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { internalAction, query } from "./_generated/server";
import authConfig from "./auth.config";
import authSchema from "./betterAuth/schema";
import { getResend } from "@/lib/resend";
import { betterAuth, type BetterAuthOptions } from "better-auth/minimal";
import { renderResetPasswordEmail, renderVerifyEmail } from "@/lib/renderEmail";

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel, typeof authSchema>(
  components.betterAuth,
  {
    local: {
      schema: authSchema,
    },
    verbose: false,
  },
);

const siteUrl = process.env.SITE_URL ?? "";
export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  return {
    baseURL: siteUrl,
    trustedOrigins: [
      "http://localhost:3000",
      "https://www.coinmaidenhub.com",
      "https://coinmaidenhub.com",
    ],
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    },
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user, url }) => {
        await getResend().emails.send({
          from: "Verdstamp <team@coinmaidenhub.com>",
          to: user.email,
          subject: "Reset your password",
          html: await renderResetPasswordEmail({
            userName: user.email,
            resetUrl: url,
          }),
        });
      },
    },
    emailVerification: {
      async sendVerificationEmail({ user, url }) {
        await getResend().emails.send({
          from: "Verdstamp <team@coinmaidenhub.com>",
          to: user.email,
          subject: "Verify your email",
          html: await renderVerifyEmail({
            userName: user.email,
            verifyUrl: url,
          }),
        });
      },
    },
    plugins: [convex({ authConfig })],
  } satisfies BetterAuthOptions;
};

export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth(createAuthOptions(ctx));

export const { getAuthUser } = authComponent.clientApi();

export const rotateKeys = internalAction({
  args: {},
  handler: async (ctx) => {
    const auth = createAuth(ctx);
    return auth.api.rotateKeys();
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.safeGetAuthUser(ctx);
  },
});
