"use client";

import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandReddit,
  IconKey,
} from "@tabler/icons-react";
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
      <ProviderIcon providerId={id} />
      Sign in with {name}
    </Button>
  );
}

function ProviderIcon({ providerId }: { providerId: string }) {
  console.log(providerId);
  switch (providerId) {
    case "github":
      return <IconBrandGithub />;
    case "discord":
      return <IconBrandDiscord />;
    case "reddit":
      return <IconBrandReddit />;
    default:
      return <IconKey />;
  }
}
