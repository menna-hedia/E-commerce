'use client';

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push('/login'); 
  }

  return (
    <span onClick={handleLogout} className="cursor-pointer bg-red-600 text-white rounded-md px-3 py-1 text-sm mx-2">
      Logout
    </span>
  );
}