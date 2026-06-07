import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2 } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6 py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FF6B00] text-white">
            <Building2 size={24} />
          </div>
          <div>
            <p className="font-display text-xl font-black text-slate-950">
              LP AI
            </p>
            <p className="text-sm text-slate-500">Painel AceleraObra</p>
          </div>
        </Link>

        <h1 className="font-display text-2xl font-black text-slate-950">
          Acesse sua conta
        </h1>
        <p className="mb-6 mt-2 text-sm leading-6 text-slate-500">
          Entre com o e-mail e a senha cadastrados para gerenciar as landing pages.
        </p>

        <LoginForm />
      </section>
    </main>
  );
}
