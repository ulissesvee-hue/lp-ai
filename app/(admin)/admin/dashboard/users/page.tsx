import { UserManager } from "@/components/admin/UserManager";
import { listDemoUsers } from "@/lib/demo-users";
import { isDemoMode } from "@/lib/demo-store";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function publicUser(user: { id: string; email: string; name: string; createdAt: Date | string }) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt:
      user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
  };
}

export default async function UsersPage() {
  let users: ReturnType<typeof publicUser>[] = [];
  let isDemoFallback = false;

  try {
    const databaseUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    users = databaseUsers.map(publicUser);
  } catch {
    if (!isDemoMode()) {
      throw new Error("Não foi possível conectar ao banco de dados.");
    }
    isDemoFallback = true;
    const demoUsers = await listDemoUsers();
    users = demoUsers.map(publicUser);
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-bold uppercase text-[#FF6B00]">
          Acesso à plataforma
        </p>
        <h1 className="font-display mt-2 text-3xl font-black text-slate-950">
          Usuários
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Cadastre quem poderá acessar o painel administrativo.
        </p>
      </div>

      {isDemoFallback ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900">
          Modo demo ativo: os usuários cadastrados aqui ficam salvos localmente
          para teste.
        </div>
      ) : null}

      <UserManager initialUsers={users} />
    </div>
  );
}
