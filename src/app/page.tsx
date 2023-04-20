import AuthProviderButton from "@/components/auth/AuthProviderButton";
import { GhostBoard } from "@/components/ghost/GhostBoard";
import Logo from "@/components/logo/Logo";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type LoginParams = {
  searchParams: {
    callbackUrl?: string;
  };
};

export default async function Login({
  searchParams: { callbackUrl },
}: LoginParams) {
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
          <header className="mt-8 mb-12 flex flex-col gap-4 justify-between items-center">
            <Logo variant="full" />
            <h3>Personal Kanban Boards</h3>
          </header>
          {providers &&
            Object.values(providers).map((provider) => (
              <AuthProviderButton
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
