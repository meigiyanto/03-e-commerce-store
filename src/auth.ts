import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

type Role = "USER" | "ADMIN";

const users = [
  {
    id: "admin-1",
    name: "Store Admin",
    email: process.env.AUTH_ADMIN_EMAIL,
    passwordHash: process.env.AUTH_ADMIN_PASSWORD_HASH,
    role: "ADMIN" as Role,
  },
  {
    id: "user-1",
    name: "Demo User",
    email: process.env.AUTH_USER_EMAIL,
    passwordHash: process.env.AUTH_USER_PASSWORD_HASH,
    role: "USER" as Role,
  },
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.toLowerCase().trim()
            : "";

        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";

        if (!email || !password) {
          return null;
        }

        const user = users.find(
          (item) => item.email?.toLowerCase() === email
        );

        if (!user || !user.passwordHash) {
          return null;
        }

        const validPassword = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!validPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.userId = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as Role;
      }

      return session;
    },
  },
});