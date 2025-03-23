import NextAuth, {
  DefaultSession,
  getServerSession,
  NextAuthOptions,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { redirect } from "next/navigation";
import { db } from "../db/client";
import { isPasswordValid } from "./hash";
import { User } from "@prisma/client";
import { env } from "@/env";

export const BASE_PATH = "/api/auth";

declare module "next-auth" {
  export interface Session extends DefaultSession {
    user: Pick<User, "id" | "email" | "name">;
    expires: Date;
  }
}

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "E-mail",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await db.user.findFirst({
          where: {
            email: {
              equals: credentials.email,
              mode: "insensitive",
            },
          },
        });

        if (!user) {
          throw new Error("Invalid e-mail or password");
        }

        const passwordsMatch = await isPasswordValid(
          credentials.password,
          user.password
        );

        if (!passwordsMatch) {
          throw new Error("Invalid e-mail or password");
        }

        return user;
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: env.NODE_ENV === "development",
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);

export const authHandler = NextAuth(authOptions);

export const getCurrentSession = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/login");
  }

  return session;
};
