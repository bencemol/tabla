import ProviderButton from "@/components/auth/ProviderButton";
import { GhostBoard } from "@/components/ghost/GhostBoard";
import Logo from "@/components/logo/Logo";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type LandingParams = {
  searchParams: {
    callbackUrl?: string;
  };
};

export default async function Landing({
  searchParams: { callbackUrl },
}: LandingParams) {
  const session = await getServerSession();
  if (session) {
    redirect("/boards");
  }
  const providers = authOptions.providers;

  return (
    <main className="min-h-screen relative">
      <GhostBoard />
      <section className="p-4 absolute inset-0 grid place-items-center">
        <div className="w-full max-w-md space-y-4 border-2 border-t-8 rounded-md p-4  shadow-xl bg-white dark:bg-zinc-900">
          <header className="mb-12 flex flex-col justify-between items-center">
            <Logo className="mb-4" />
            <h3>Personal Kanban Boards</h3>
          </header>
          {providers &&
            Object.values(providers).map((provider) => (
              <ProviderButton
                key={provider.name}
                id={provider.id}
                name={provider.name}
                callbackUrl={callbackUrl}
              />
            ))}
        </div>
      </section>
    </main>
  );
}
