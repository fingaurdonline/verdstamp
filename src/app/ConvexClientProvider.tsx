"use client";

import { ReactNode, useEffect, useMemo, useRef } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useSession } from "@/lib/auth-client";

function EnsureUser() {
  const { data: session } = useSession();
  const ensureUser = useMutation(api.user.ensure_user);
  const lastUserId = useRef<string | null>(null);

  useEffect(() => {
    const userId = (session as any)?.user?.id as string | undefined;
    const email = (session as any)?.user?.email as string | undefined;
    const name = (session as any)?.user?.name as string | undefined;
    if (!userId || !email) return;
    if (lastUserId.current === userId) return;
    lastUserId.current = userId;

    const username = name || email.split("@")[0] || email;
    ensureUser({ email, username }).catch(() => {});
  }, [ensureUser, session]);

  return null;
}

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const convex = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      throw new Error("Missing NEXT_PUBLIC_CONVEX_URL");
    }
    return new ConvexReactClient(url);
  }, []);

  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      <EnsureUser />
      {children}
    </ConvexBetterAuthProvider>
  );
}
