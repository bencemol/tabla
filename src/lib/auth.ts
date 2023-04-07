import { db } from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions, DefaultSession, User, getServerSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { Provider } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import RedditProvider from "next-auth/providers/reddit";
import { notFound } from "next/navigation";
import { createSampleBoard } from "./onboarding";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
  }
}

const mockUser: User = {
  id: "clfmwi6xd000108ma5l6sffuu",
  name: "Jane Doe",
  email: "jane.doe@mail.org",
  image:
    "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' fill='white' stroke='black' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.25' class='icon icon-tabler icon-tabler-mood-tongue' viewBox='0 0 24 24'%3e%3cpath stroke='none' d='M0 0h24v24H0z'/%3e%3cpath d='M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0M9 10h.01M15 10h.01'/%3e%3cpath d='M10 14v2a2 2 0 0 0 4 0v-2m1.5 0h-7'/%3e%3c/svg%3e",
};

const MockProvider = CredentialsProvider({
  credentials: {},
  authorize: () => mockUser,
});
MockProvider.name = "Mock Provider";
MockProvider.id = "mockProvider";

const providers: Provider[] = [
  GithubProvider({
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  }),
  DiscordProvider({
    clientId: process.env.DISCORD_CLIENT_ID!,
    clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  }),
  RedditProvider({
    clientId: process.env.REDDIT_CLIENT_ID!,
    clientSecret: process.env.REDDIT_CLIENT_SECRET!,
  }),
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),
];

if (process.env.NEXTAUTH_MOCK) {
  db.user.upsert({
    where: { id: mockUser.id },
    create: mockUser,
    update: mockUser,
  });
  providers.unshift(MockProvider);
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  providers,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      await createSampleBoard(user.id);
    },
  },
};

export async function getServerSessionUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function isAuthorized(boardId: string) {
  const [user, board] = await Promise.all([
    getServerSessionUser(),
    db.board.findUnique({ where: { id: boardId }, select: { ownerId: true } }),
  ]);
  if (!board) {
    notFound();
  }
  const isAuthorized = board.ownerId === user.id;
  return isAuthorized;
}
