"use client";

import { signIn } from "next-auth/react";
import Button from "../button/Button";

export default function ProviderSignIn({
  id,
  name,
  callbackUrl = "/boards",
}: {
  id: string;
  name: string;
  callbackUrl?: string;
}) {
  return (
    <Button onClick={() => signIn(id, { callbackUrl })}>
      Sign in with {name}
    </Button>
  );
}
