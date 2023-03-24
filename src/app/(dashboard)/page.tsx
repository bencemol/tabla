import ProviderSignIn from "@/components/auth/ProviderSignIn";
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
    <main className="min-h-screen grid place-items-center">
      <section className="p-4 space-x-4">
        {providers &&
          Object.values(providers).map((provider) => (
            <ProviderSignIn
              key={provider.name}
              id={provider.id}
              name={provider.name}
              callbackUrl={callbackUrl}
            />
          ))}
      </section>
    </main>
  );
}
