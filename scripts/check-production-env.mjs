import { existsSync, readFileSync } from "node:fs";

function loadLocalEnv() {
  if (!existsSync(".env.local")) return;

  const lines = readFileSync(".env.local", "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadLocalEnv();

const required = [
  "BASE_DOMAIN",
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "ADMIN_NAME",
];

const missing = required.filter((key) => !process.env[key]?.trim());

if (missing.length > 0) {
  console.error("Variáveis de ambiente obrigatórias ausentes:");
  for (const key of missing) {
    console.error(`- ${key}`);
  }
  process.exit(1);
}

const nextAuthUrl = process.env.NEXTAUTH_URL;
const baseDomain = process.env.BASE_DOMAIN;

if (nextAuthUrl && baseDomain && !nextAuthUrl.includes(baseDomain)) {
  console.error(
    `NEXTAUTH_URL precisa apontar para o domínio principal (${baseDomain}).`,
  );
  process.exit(1);
}

console.log("Ambiente de produção validado.");
