"use client";

import { signIn } from "next-auth/react";
import Button from "../button/Button";

export default function ProviderButton({
  id,
  name,
  callbackUrl = "/boards",
}: {
  id: string;
  name: string;
  callbackUrl?: string;
}) {
  return (
    <Button
      onClick={() => signIn(id, { callbackUrl })}
      className="block w-full justify-center"
      variant="primary"
    >
      Sign in with {name}
    </Button>
  );
}
