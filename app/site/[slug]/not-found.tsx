import Link from "next/link";

export default function SiteNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6 py-10">
      <section className="max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-black uppercase text-[#FF6B00]">
          Página indisponível
        </p>
        <h1 className="font-display mt-3 text-3xl font-black text-slate-950">
          Esta loja não está ativa.
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          A landing page pode não existir, estar inativa ou ainda não ter sido
          publicada.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-slate-950 px-5 text-sm font-bold text-white"
        >
          Voltar
        </Link>
      </section>
    </main>
  );
}
