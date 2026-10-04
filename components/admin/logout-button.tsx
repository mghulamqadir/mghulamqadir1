"use client";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
export function LogoutButton() { const router = useRouter(); return <button onClick={async () => { await signOut({ redirect: false }); router.push("/login"); }} className="text-sm text-[#a1a1aa] hover:text-white">Logout</button>; }
