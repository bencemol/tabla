import { db } from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { Provider } from "next-auth/providers";

const MockProvider = CredentialsProvider({
  credentials: {},
  authorize: async () => ({
    id: "clfmwi6xd000108ma5l6sffuu",
    name: "Jane Doe",
    email: "jane.doe@mail.org",
    image:
      "https://upload.wikimedia.org/wikipedia/en/b/b5/Converge-JaneDoe.jpg",
  }),
});
MockProvider.name = "Mock 🔑";

const providers: Provider[] = [
  GithubProvider({
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  }),
];

if (process.env.NEXTAUTH_MOCK) {
  providers.unshift(MockProvider);
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
  },
  providers,
};
