import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getDemoUserByEmail } from "@/lib/demo-users";
import { isDemoMode } from "@/lib/demo-store";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "E-mail e senha",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const email = credentials.email.toLowerCase().trim();
        const demoEmail =
          process.env.DEMO_ADMIN_EMAIL?.toLowerCase().trim() ||
          "admin@aceleraobra.com.br";
        const demoPassword = process.env.DEMO_ADMIN_PASSWORD || "demo123456";

        if (isDemoMode() && email === demoEmail && credentials.password === demoPassword) {
          return {
            id: "demo-admin",
            email: demoEmail,
            name: "Admin Demo",
          };
        }

        let user = null;

        try {
          user = await prisma.user.findUnique({
            where: { email },
          });
        } catch {
          if (!isDemoMode()) return null;
          user = await getDemoUserByEmail(email);
        }

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export async function getAdminSession() {
  return getServerSession(authOptions);
}
