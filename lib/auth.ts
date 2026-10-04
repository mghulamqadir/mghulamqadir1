import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { collection } from "@/lib/database/mongodb";

type Profile = { id: string; email?: string; password_hash?: string; role: "admin" | "editor" };

export const authOptions: NextAuthOptions = {
  secret: env.AUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/login" },
  providers: [CredentialsProvider({
    name: "Portfolio owner",
    credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
    async authorize(credentials) {
      const email = credentials?.email?.trim().toLowerCase();
      const password = credentials?.password;
      if (!email || !password) return null;
      const profile = await collection<Profile>("profiles").then((items) => items.findOne({ email }));
      if (!profile?.password_hash || profile.role !== "admin" || !(await bcrypt.compare(password, profile.password_hash))) return null;
      return { id: profile.id, email: profile.email, role: profile.role };
    },
  })],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.role = user.role; }
      return token;
    },
    async session({ session, token }) {
      if (session.user) { session.user.id = String(token.id); session.user.role = token.role === "admin" ? "admin" : "editor"; }
      return session;
    },
  },
};

export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "admin") return null;
  return { user: { id: session.user.id, email: session.user.email ?? "", role: "admin" as const } };
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/login");
  return session;
}
