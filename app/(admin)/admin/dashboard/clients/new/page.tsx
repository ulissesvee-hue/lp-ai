import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ClientForm } from "@/components/admin/ClientForm";
import { clientFormDefaults } from "@/lib/validations";

export const dynamic = "force-dynamic";

export default function NewClientPage() {
  return (
    <div className="grid gap-6">
      <div>
        <Link
          href="/admin/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#FF6B00]"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>
        <h1 className="font-display text-3xl font-black text-slate-950">
          Novo cliente
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Preencha os dados da loja para gerar a landing page.
        </p>
      </div>

      <ClientForm mode="create" initialValues={clientFormDefaults} />
    </div>
  );
}
