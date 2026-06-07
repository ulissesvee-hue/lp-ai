import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  ensureLogoBucket,
  LOGO_BUCKET,
  LOGO_MAX_BYTES,
  LOGO_MIME_TYPES,
} from "@/lib/supabase";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

function getExtension(file: File) {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Envie um arquivo de imagem." },
        { status: 422 },
      );
    }

    if (!LOGO_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: "Use JPG, PNG ou WebP." },
        { status: 422 },
      );
    }

    if (file.size > LOGO_MAX_BYTES) {
      return NextResponse.json(
        { message: "O logo deve ter no máximo 2 MB." },
        { status: 422 },
      );
    }

    const extension = getExtension(file);
    const arrayBuffer = await file.arrayBuffer();
    const hasSupabaseConfig = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    if (!hasSupabaseConfig && process.env.DEMO_ADMIN_ENABLED === "true") {
      const fileName = `${crypto.randomUUID()}.${extension}`;
      const uploadDir = join(process.cwd(), "public", "uploads", "client-logos");
      const publicPath = `/uploads/client-logos/${fileName}`;

      await mkdir(uploadDir, { recursive: true });
      await writeFile(join(uploadDir, fileName), Buffer.from(arrayBuffer));

      return NextResponse.json({ url: publicPath });
    }

    const supabase = await ensureLogoBucket();
    const path = `logos/${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from(LOGO_BUCKET)
      .upload(path, arrayBuffer, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(LOGO_BUCKET).getPublicUrl(path);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível enviar o arquivo.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
