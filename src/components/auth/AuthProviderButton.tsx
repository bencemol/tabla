"use client";

import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandReddit,
  IconKey,
} from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Button from "../button/Button";

const buttonVariant: { [key: string]: string } = {
  mockProvider: "!bg-black",
  github: "!bg-black",
  discord: "!bg-[#7289DA]",
  reddit: "!bg-[#FF4500]",
  google: "!bg-[#4285F4]",
};

export default function AuthProviderButton({
  id,
  name,
  callbackUrl = "/boards",
}: {
  id: string;
  name: string;
  callbackUrl?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await signIn(id, { callbackUrl });
    setIsLoading(false);
  };

  return (
    <Button
      onClick={handleClick}
      isLoading={isLoading}
      className={`block w-full justify-center !text-white !border-transparent ${buttonVariant[id]}`}
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
