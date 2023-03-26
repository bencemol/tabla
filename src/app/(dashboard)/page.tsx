import ProviderButton from "@/components/auth/ProviderButton";
import { GhostColumn } from "@/components/ghost/GhostBoard";
import { authOptions } from "@/lib/auth";

type LandingParams = {
  searchParams: {
    callbackUrl?: string;
  };
};

export default async function Landing({
  searchParams: { callbackUrl },
}: LandingParams) {
  const providers = authOptions.providers;
  return (
    <main className="min-h-[100svh] relative">
      <section className="max-h-screen grid grid-flow-col p-4 gap-6 overflow-hidden opacity-5 dark:opacity-20">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <GhostColumn key={i} index={i} />
          ))}
      </section>
      <section className="p-4 absolute inset-0 grid place-items-center">
        <div className="w-full max-w-md space-y-4 border-2 border-t-8 rounded-md p-4 shadow-xl bg-white dark:bg-zinc-900">
          <h3>Tábla</h3>
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
