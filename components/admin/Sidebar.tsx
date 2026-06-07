import Link from "next/link";
import { LayoutDashboard, Plus, Store, Users } from "lucide-react";
import { LogoutButton } from "@/components/admin/LogoutButton";

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[#0F172A] p-5 text-white lg:flex">
      <Link href="/admin/dashboard" className="mb-9 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FF6B00]">
          <Store size={24} />
        </div>
        <div>
          <p className="font-display text-xl font-black">LP AI</p>
          <p className="text-xs text-slate-400">AceleraObra</p>
        </div>
      </Link>

      <nav className="grid gap-2">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
        <Link
          href="/admin/dashboard/clients/new"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
        >
          <Plus size={18} />
          Novo cliente
        </Link>
        <Link
          href="/admin/dashboard/users"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
        >
          <Users size={18} />
          Usuários
        </Link>
      </nav>

      <div className="mt-auto">
        <LogoutButton />
      </div>
    </aside>
  );
}
