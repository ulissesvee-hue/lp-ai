import Link from "next/link";
import { ArrowRight, Building2, Globe2, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-10">
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#ff6b00] text-white">
              <Building2 size={24} />
            </div>
            <div>
              <p className="font-display text-xl font-black">LP AI</p>
              <p className="text-sm text-slate-500">AceleraObra</p>
            </div>
          </div>
          <Link
            href="/admin/login"
            className="inline-flex h-11 items-center justify-center rounded-md bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Entrar
          </Link>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="mb-4 inline-flex rounded-md bg-white px-3 py-2 text-sm font-bold text-[#ff6b00] shadow-sm">
              Micro SaaS B2B para lojas de construção
            </p>
            <h1 className="font-display max-w-3xl text-4xl font-black leading-tight text-slate-950 md:text-6xl">
              Landing pages prontas para cada loja em poucos minutos.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Cadastre os dados do cliente, publique em um subdomínio da
              AceleraObra e entregue uma presença digital profissional para
              lojas de materiais de construção e tinta.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/admin/login"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#ff6b00] px-6 font-bold text-white transition hover:bg-[#df5f03]"
              >
                Acessar painel <ArrowRight size={18} />
              </Link>
              <a
                href="https://aceleraobra.com.br"
                className="inline-flex h-12 items-center justify-center rounded-md border border-slate-200 bg-white px-6 font-bold text-slate-800 transition hover:border-slate-300"
              >
                AceleraObra
              </a>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              {
                icon: Globe2,
                title: "Subdomínios automáticos",
                text: "Cada cliente ganha uma página própria dentro do domínio da AceleraObra.",
              },
              {
                icon: Building2,
                title: "Feito para home centers",
                text: "Produtos, avaliações, endereço, WhatsApp e SEO local no mesmo fluxo.",
              },
              {
                icon: ShieldCheck,
                title: "Painel interno",
                text: "Apenas funcionários autorizados criam, editam e publicam páginas.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <item.icon className="mb-4 text-[#ff6b00]" size={28} />
                <h2 className="font-display text-lg font-black">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
