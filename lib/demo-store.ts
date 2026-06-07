import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { ClientInput } from "@/lib/validations";

export type DemoReview = {
  id: string;
  createdAt: string;
  clientId: string;
  authorName: string;
  rating: number;
  comment: string;
  reviewDate: string;
};

export type DemoClient = Omit<ClientInput, "reviews"> & {
  id: string;
  createdAt: string;
  updatedAt: string;
  reviews: DemoReview[];
};

const dataDir = join(process.cwd(), "data");
const dataFile = join(dataDir, "demo-clients.json");

export function isDemoMode() {
  return process.env.DEMO_ADMIN_ENABLED === "true";
}

async function readDemoClients() {
  if (!existsSync(dataFile)) {
    return [] as DemoClient[];
  }

  const content = await readFile(dataFile, "utf8");
  if (!content.trim()) return [];
  return JSON.parse(content) as DemoClient[];
}

async function writeDemoClients(clients: DemoClient[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify(clients, null, 2));
}

export async function listDemoClients(query?: string) {
  const clients = await readDemoClients();
  const normalized = query?.trim().toLowerCase();

  return clients
    .filter((client) => {
      if (!normalized) return true;
      return [client.storeName, client.slug, client.city].some((value) =>
        value.toLowerCase().includes(normalized),
      );
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function countDemoClients() {
  const clients = await readDemoClients();
  return clients.length;
}

export async function getDemoClientById(id: string) {
  const clients = await readDemoClients();
  return clients.find((client) => client.id === id) ?? null;
}

export async function getDemoClientBySlug(slug: string) {
  const clients = await readDemoClients();
  return clients.find((client) => client.slug === slug) ?? null;
}

export async function createDemoClient(input: ClientInput) {
  const clients = await readDemoClients();
  const duplicate = clients.find((client) => client.slug === input.slug);

  if (duplicate) {
    throw new Error("Este slug já está em uso.");
  }

  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const client: DemoClient = {
    ...input,
    ownerName: input.ownerName || input.storeName,
    email: null,
    complement: null,
    googlePlaceId: null,
    ga4MeasurementId: null,
    id,
    createdAt: now,
    updatedAt: now,
    reviews: input.reviews.map((review) => ({
      id: crypto.randomUUID(),
      createdAt: now,
      clientId: id,
      authorName: review.authorName,
      rating: review.rating,
      comment: review.comment,
      reviewDate: review.reviewDate || now,
    })),
  };

  await writeDemoClients([client, ...clients]);
  return client;
}

export async function updateDemoClient(id: string, input: ClientInput) {
  const clients = await readDemoClients();
  const index = clients.findIndex((client) => client.id === id);

  if (index === -1) {
    return null;
  }

  const duplicate = clients.find(
    (client) => client.slug === input.slug && client.id !== id,
  );

  if (duplicate) {
    throw new Error("Este slug já está em uso.");
  }

  const now = new Date().toISOString();
  const updated: DemoClient = {
    ...clients[index],
    ...input,
    ownerName: input.ownerName || input.storeName,
    email: null,
    complement: null,
    googlePlaceId: null,
    ga4MeasurementId: null,
    updatedAt: now,
    reviews: input.reviews.map((review) => ({
      id: review.id || crypto.randomUUID(),
      createdAt: now,
      clientId: id,
      authorName: review.authorName,
      rating: review.rating,
      comment: review.comment,
      reviewDate: review.reviewDate || now,
    })),
  };

  clients[index] = updated;
  await writeDemoClients(clients);
  return updated;
}

export async function deactivateDemoClient(id: string) {
  return setDemoClientActive(id, false);
}

export async function setDemoClientActive(id: string, isActive: boolean) {
  const clients = await readDemoClients();
  const index = clients.findIndex((client) => client.id === id);

  if (index === -1) {
    return null;
  }

  clients[index] = {
    ...clients[index],
    isActive,
    updatedAt: new Date().toISOString(),
  };
  await writeDemoClients(clients);
  return clients[index];
}

export async function deleteDemoClient(id: string) {
  const clients = await readDemoClients();
  const nextClients = clients.filter((client) => client.id !== id);

  if (nextClients.length === clients.length) {
    return null;
  }

  await writeDemoClients(nextClients);
  return { id };
}
