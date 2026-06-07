import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

export type DemoUser = {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
};

const dataDir = join(process.cwd(), "data");
const dataFile = join(dataDir, "demo-users.json");

async function readDemoUsers() {
  if (!existsSync(dataFile)) {
    return [] as DemoUser[];
  }

  const content = await readFile(dataFile, "utf8");
  if (!content.trim()) return [];
  return JSON.parse(content) as DemoUser[];
}

async function writeDemoUsers(users: DemoUser[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify(users, null, 2));
}

export async function listDemoUsers() {
  const users = await readDemoUsers();
  return users.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getDemoUserByEmail(email: string) {
  const users = await readDemoUsers();
  return users.find((user) => user.email === email.toLowerCase().trim()) ?? null;
}

export async function createDemoUser(input: {
  email: string;
  name: string;
  password: string;
}) {
  const users = await readDemoUsers();
  const email = input.email.toLowerCase().trim();

  if (users.some((user) => user.email === email)) {
    throw new Error("Este e-mail já está cadastrado.");
  }

  const user: DemoUser = {
    id: crypto.randomUUID(),
    email,
    name: input.name,
    password: input.password,
    createdAt: new Date().toISOString(),
  };

  await writeDemoUsers([user, ...users]);
  return user;
}

export async function deleteDemoUser(id: string) {
  const users = await readDemoUsers();
  const nextUsers = users.filter((user) => user.id !== id);

  if (nextUsers.length === users.length) {
    return null;
  }

  await writeDemoUsers(nextUsers);
  return { id };
}
