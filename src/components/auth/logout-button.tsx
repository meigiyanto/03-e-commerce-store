"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  async function handleLogout() {
    console.log("LOGOUT: mulai");

    try {
      const result = await signOut({
        redirect: false,
      });

      console.log("LOGOUT RESULT:", result);

      window.location.href = "/login";
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="hover:text-slate-900"
    >
      Logout
    </button>
  );
}