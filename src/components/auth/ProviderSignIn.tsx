"use client";

import { signIn } from "next-auth/react";
import Button from "../button/Button";

export default function ProviderSignIn({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  return (
    <Button onClick={() => signIn(id, { callbackUrl: "/boards" })}>
      Sign in with {name}
    </Button>
  );
}
