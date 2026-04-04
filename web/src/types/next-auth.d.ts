import type { DefaultSession } from "next-auth";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "member" | "moderator" | "admin";
      status: "active" | "restricted" | "suspended" | "deleted";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    role?: "member" | "moderator" | "admin";
    status?: "active" | "restricted" | "suspended" | "deleted";
  }
}
