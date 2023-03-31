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
  image: "https://upload.wikimedia.org/wikipedia/en/b/b5/Converge-JaneDoe.jpg",
};

const MockProvider = CredentialsProvider({
  credentials: {},
  authorize: () => mockUser,
});
MockProvider.name = "Mock Provider";

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
  debug: true,
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
