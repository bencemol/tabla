"use client";

import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandReddit,
  IconKey,
} from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import Button from "../button/Button";

const buttonVariant: { [key: string]: string } = {
  github: "bg-black text-white border-transparent",
  discord: "!bg-[#7289DA] !text-white !border-transparent",
  reddit: "!bg-[#FF4500] !text-white !border-transparent",
  google: "!bg-[#4285F4] !text-white !border-transparent",
};

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
      className={`block w-full justify-center border-current ${buttonVariant[id]}`}
      variant="primary"
    >
      <ProviderIcon providerId={id} />
      Sign in with {name}
    </Button>
  );
}

function ProviderIcon({ providerId }: { providerId: string }) {
  switch (providerId) {
    case "github":
      return <IconBrandGithub />;
    case "discord":
      return <IconBrandDiscord />;
    case "reddit":
      return <IconBrandReddit />;
    case "google":
      return <IconBrandGoogle />;
    default:
      return <IconKey />;
  }
}
