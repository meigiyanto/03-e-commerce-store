"use client";

import { useClerk } from "@clerk/nextjs";

export default function LogoutButton() {
  const { signOut } = useClerk();

  async function handleLogout() {
    await signOut({
      redirectUrl: "/login",
    });
  }

  return (
    // <button
    //   type="button"
    //   onClick={handleLogout}
    //   className="hover:text-slate-900"
    // >
    //   Logout
    // </button>
    <button
      type="button"
      onClick={() => {
        console.log("CLERK LOGOUT CLICKED");
        signOut({
          redirectUrl: "/login",
        });
      }}
      className="hover:text-slate-900"
    >
      Logout
    </button>
  );
}