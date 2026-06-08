"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, useForm } from "react-hook-form";
import {
  Check,
  Clock,
  Globe,
  ImagePlus,
  MapPin,
  MessageCircle,
  Plus,
  Save,
  Star,
  Store,
  Tag,
  Target,
  Trash2,
  UploadCloud,
  User,
  X,
} from "lucide-react";
import { LogoUpload } from "@/components/admin/LogoUpload";
import {
  brazilianStates,
  clientInputSchema,
  productSuggestions,
  type ClientInput,
} from "@/lib/validations";
import { getClientPublicUrl } from "@/lib/format";

type ClientFormProps = {
  mode: "create" | "edit";
  clientId?: string;
  initialValues: ClientInput;
};

type ReviewDraft = {
  authorName: string;
  rating: number;
  comment: string;
  reviewDate: string;
};

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-orange-50 text-[#FF6B00]">
          <Icon size={20} />
        </div>
        <h2 className="font-display text-lg font-black text-slate-950">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-semibold text-red-600">{message}</p>;
}

export function ClientForm({ mode, clientId, initialValues }: ClientFormProps) {
  const router = useRouter();
  const [toast, setToast] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const brandLogoInputRef = useRef<HTMLInputElement>(null);
  const [serviceInput, setServiceInput] = useState("");
  const [isBrandUploading, setIsBrandUploading] = useState(false);
  const [isFetchingReviews, setIsFetchingReviews] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewDraft, setReviewDraft] = useState<ReviewDraft>({
    authorName: "",
    rating: 5,
    comment: "",
    reviewDate: new Date().toISOString().slice(0, 10),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClientInput>({
    resolver: zodResolver(clientInputSchema) as never,
    defaultValues: initialValues,
  });

  const slug = watch("slug");
  const logoUrl = watch("logoUrl");
  const services = watch("services") || [];
  const brandLogos = watch("brandLogos") || [];
  const reviews = watch("reviews") || [];
  const googleBusinessUrl = watch("googleBusinessUrl");
  const publicUrl = useMemo(
    () => (slug ? getClientPublicUrl(slug) : "{slug}.aceleraobra.com.br"),
    [slug],
  );

  function addService(value: string) {
    const service = value.trim();
    if (!service) return;
    if (services.some((item) => item.toLowerCase() === service.toLowerCase())) {
      setServiceInput("");
      return;
    }
    setValue("services", [...services, service], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setServiceInput("");
  }

  function removeService(service: string) {
    setValue(
      "services",
      services.filter((item) => item !== service),
      { shouldDirty: true, shouldValidate: true },
    );
  }

  function addReview() {
    if (!reviewDraft.authorName.trim() || !reviewDraft.comment.trim()) return;

    setValue(
      "reviews",
      [
        ...reviews,
        {
          authorName: reviewDraft.authorName.trim(),
          rating: reviewDraft.rating,
          comment: reviewDraft.comment.trim(),
          reviewDate: reviewDraft.reviewDate,
        },
      ],
      { shouldDirty: true, shouldValidate: true },
    );
    setReviewDraft({
      authorName: "",
      rating: 5,
      comment: "",
      reviewDate: new Date().toISOString().slice(0, 10),
    });
    setIsReviewModalOpen(false);
  }

  function removeReview(index: number) {
    setValue(
      "reviews",
      reviews.filter((_, reviewIndex) => reviewIndex !== index),
      { shouldDirty: true, shouldValidate: true },
    );
  }

  async function uploadBrandLogo(file?: File) {
    if (!file) return;
    setToast("");
    setIsBrandUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const payload = await response.json();
    setIsBrandUploading(false);

    if (!response.ok) {
      setToast(payload.message || "Não foi possível enviar a marca.");
      return;
    }

    setValue("brandLogos", [...brandLogos, payload.url], {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function removeBrandLogo(url: string) {
    setValue(
      "brandLogos",
      brandLogos.filter((item) => item !== url),
      { shouldDirty: true, shouldValidate: true },
    );
  }

  async function fetchGoogleReviews() {
    if (!googleBusinessUrl) {
      setToast("Informe o link do Google Meu Negócio antes de buscar avaliações.");
      return;
    }

    setToast("");
    setIsFetchingReviews(true);
    const response = await fetch("/api/google-reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ googleBusinessUrl }),
    });
    const payload = await response.json();
    setIsFetchingReviews(false);

    if (!response.ok) {
      setToast(payload.message || "Não foi possível buscar avaliações.");
      return;
    }

    setValue("reviews", payload.reviews, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("googleRating", 5, { shouldDirty: true, shouldValidate: true });
    setValue("googleReviewCount", payload.reviews.length, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setToast(`${payload.reviews.length} avaliações 5 estrelas adicionadas.`);
  }

  function showValidationSummary(formErrors: FieldErrors<ClientInput>) {
    const labels: Record<string, string> = {
      slug: "Slug",
      storeName: "Nome da loja",
      logoUrl: "Logo",
      bio: "Biografia",
      whatsapp: "WhatsApp",
      address: "Rua e número",
      city: "Cidade",
      state: "Estado",
      googleBusinessUrl: "URL do Google",
      googleRating: "Nota média",
      primaryColor: "Cor principal",
      secondaryColor: "Cor secundária",
      metaPixelId: "Pixel da Meta",
      googleAdsPixelId: "Pixel do Google Ads",
      webhookUrl: "Webhook do CRM",
    };
    const firstKey = Object.keys(formErrors)[0];
    const label = labels[firstKey] || firstKey || "formulário";

    setToast(`Revise o campo: ${label}.`);
  }

  async function submit(values: ClientInput, isActive: boolean) {
    setToast("");
    setIsSaving(true);

    const response = await fetch(
      mode === "create" ? "/api/clients" : `/api/clients/${clientId}`,
      {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, isActive }),
      },
    );

    const payload = await response.json();
    setIsSaving(false);

    if (!response.ok) {
      const fieldErrors = payload.error?.fieldErrors;
      const firstField = fieldErrors ? Object.keys(fieldErrors)[0] : "";
      const firstMessage = firstField ? fieldErrors[firstField]?.[0] : "";
      setToast(firstMessage || payload.message || "Não foi possível salvar.");
      return;
    }

    setToast(isActive ? "Cliente salvo e publicado." : "Rascunho salvo.");
    router.push("/admin/dashboard");
    router.refresh();
  }

  const saveDraft = handleSubmit(
    (values) => submit(values, false),
    showValidationSummary,
  );
  const publish = handleSubmit(
    (values) => submit(values, true),
    showValidationSummary,
  );

  return (
    <div className="grid gap-5">
      {toast ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {toast}
        </div>
      ) : null}

      <form className="grid gap-5" onSubmit={publish}>
        <Section icon={Globe} title="Subdomínio">
          <div className="grid gap-4 md:grid-cols-[1fr_180px]">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Slug
              <input
                {...register("slug")}
                placeholder="lojadoseujoao"
                className="h-11 rounded-md border border-slate-200 px-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
              />
              <span className="text-xs font-medium text-slate-500">
                Esta loja será publicada em: {publicUrl}
              </span>
              <ErrorText message={errors.slug?.message} />
            </label>

            <label className="flex items-center gap-3 rounded-md border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">
              <input
                type="checkbox"
                {...register("isActive")}
                className="h-5 w-5 rounded border-slate-300 text-[#FF6B00]"
              />
              Página ativa
            </label>
          </div>
        </Section>

        <Section icon={Store} title="Identidade da loja">
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Nome da loja
              <input
                {...register("storeName")}
                className="h-11 rounded-md border border-slate-200 px-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
              />
              <ErrorText message={errors.storeName?.message} />
            </label>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[280px_1fr]">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Logo
              <LogoUpload
                value={logoUrl}
                onChange={(url) =>
                  setValue("logoUrl", url, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                onColorsDetected={(colors) => {
                  setValue("primaryColor", colors.primaryColor, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  setValue("secondaryColor", colors.secondaryColor, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              />
              <ErrorText message={errors.logoUrl?.message} />
            </label>

            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Biografia
              <textarea
                {...register("bio")}
                rows={7}
                className="rounded-md border border-slate-200 px-3 py-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
              />
              <ErrorText message={errors.bio?.message} />
            </label>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Cor principal
              <input
                type="color"
                {...register("primaryColor")}
                className="h-11 w-full rounded-md border border-slate-200 bg-white p-1"
              />
              <ErrorText message={errors.primaryColor?.message} />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Cor secundária
              <input
                type="color"
                {...register("secondaryColor")}
                className="h-11 w-full rounded-md border border-slate-200 bg-white p-1"
              />
              <ErrorText message={errors.secondaryColor?.message} />
            </label>
          </div>
        </Section>

        <Section icon={MessageCircle} title="Contato">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Telefone fixo
              <input
                {...register("phone")}
                className="h-11 rounded-md border border-slate-200 px-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              WhatsApp
              <input
                {...register("whatsapp")}
                placeholder="(61) 99999-9999"
                className="h-11 rounded-md border border-slate-200 px-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
              />
              <ErrorText message={errors.whatsapp?.message} />
            </label>
          </div>
        </Section>

        <Section icon={Star} title="Google Meu Negócio">
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Link do perfil
              <input
                {...register("googleBusinessUrl")}
                className="h-11 rounded-md border border-slate-200 px-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
              />
              <ErrorText message={errors.googleBusinessUrl?.message} />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={fetchGoogleReviews}
              disabled={isFetchingReviews}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-[#FF6B00] hover:text-[#FF6B00] disabled:opacity-60"
            >
              <Star size={16} />
              {isFetchingReviews ? "Buscando..." : "Buscar dados do Google"}
            </button>
            <span className="text-xs font-semibold text-slate-500">
              Preenche somente as avaliações. Endereço e horários ficam manuais.
            </span>
          </div>
        </Section>

        <Section icon={MapPin} title="Endereço">
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Rua e número
              <input
                {...register("address")}
                className="h-11 rounded-md border border-slate-200 px-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
              />
              <ErrorText message={errors.address?.message} />
            </label>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_120px_160px]">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Bairro
              <input
                {...register("neighborhood")}
                className="h-11 rounded-md border border-slate-200 px-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Cidade
              <input
                {...register("city")}
                className="h-11 rounded-md border border-slate-200 px-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
              />
              <ErrorText message={errors.city?.message} />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Estado
              <select
                {...register("state")}
                className="h-11 rounded-md border border-slate-200 px-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
              >
                <option value="">UF</option>
                {brazilianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <ErrorText message={errors.state?.message} />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              CEP
              <input
                {...register("zipCode")}
                className="h-11 rounded-md border border-slate-200 px-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
              />
            </label>
          </div>
        </Section>

        <Section icon={Clock} title="Horários">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Funcionamento
            <input
              {...register("openingHours")}
              placeholder="Seg a sex: 8h às 18h | Sáb: 8h às 13h | Dom: fechado"
              className="h-11 rounded-md border border-slate-200 px-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
            />
          </label>
        </Section>

        <Section icon={User} title="Redes sociais">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Instagram
              <input
                {...register("instagram")}
                placeholder="@nomedaloja"
                className="h-11 rounded-md border border-slate-200 px-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Facebook
              <input
                {...register("facebook")}
                className="h-11 rounded-md border border-slate-200 px-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
              />
            </label>
          </div>
        </Section>

        <Section icon={Target} title="Conversões e CRM">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Pixel da Meta
              <input
                {...register("metaPixelId")}
                placeholder="123456789012345"
                className="h-11 rounded-md border border-slate-200 px-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
              />
              <span className="text-xs font-medium text-slate-500">
                Informe somente o ID numérico do pixel.
              </span>
              <ErrorText message={errors.metaPixelId?.message} />
            </label>

            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Pixel do Google Ads
              <input
                {...register("googleAdsPixelId")}
                placeholder="AW-123456789/AbCdEfGh"
                className="h-11 rounded-md border border-slate-200 px-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
              />
              <span className="text-xs font-medium text-slate-500">
                Use o ID da conversão, de preferência com label.
              </span>
              <ErrorText message={errors.googleAdsPixelId?.message} />
            </label>
          </div>

          <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
            Webhook do CRM
            <input
              {...register("webhookUrl")}
              placeholder="https://seu-crm.com/webhook/leads"
              className="h-11 rounded-md border border-slate-200 px-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
            />
            <span className="text-xs font-medium text-slate-500">
              Quando o lead enviar o formulário, os dados serão enviados para esta URL.
            </span>
            <ErrorText message={errors.webhookUrl?.message} />
          </label>
        </Section>

        <Section icon={Tag} title="Produtos">
          <div className="flex gap-2">
            <input
              value={serviceInput}
              onChange={(event) => setServiceInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addService(serviceInput);
                }
              }}
              placeholder="Digite e pressione Enter"
              className="h-11 min-w-0 flex-1 rounded-md border border-slate-200 px-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
            />
            <button
              type="button"
              onClick={() => addService(serviceInput)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[#FF6B00] text-white transition hover:bg-[#df5f03]"
              title="Adicionar produto"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {productSuggestions.map((suggestion) => (
              <button
                type="button"
                key={suggestion}
                onClick={() => addService(suggestion)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600 transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {services.map((service) => (
              <span
                key={service}
                className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700"
              >
                {service}
                <button
                  type="button"
                  onClick={() => removeService(service)}
                  className="text-slate-500 hover:text-red-600"
                  title="Remover produto"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </Section>

        <Section icon={ImagePlus} title="Marcas vendidas">
          <input
            ref={brandLogoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => uploadBrandLogo(event.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => brandLogoInputRef.current?.click()}
            disabled={isBrandUploading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-[#FF6B00] hover:text-[#FF6B00] disabled:opacity-60"
          >
            <UploadCloud size={16} />
            {isBrandUploading ? "Enviando..." : "Adicionar logo de marca"}
          </button>

          <div className="mt-4 grid gap-3 sm:grid-cols-3 md:grid-cols-5">
            {brandLogos.map((url) => (
              <div
                key={url}
                className="relative flex h-24 items-center justify-center rounded-md border border-slate-200 bg-slate-50 p-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="Logo da marca" className="max-h-full max-w-full object-contain" />
                <button
                  type="button"
                  onClick={() => removeBrandLogo(url)}
                  className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm hover:text-red-600"
                  title="Remover marca"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={Star} title="Avaliações do Google">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-500">
              Use avaliações buscadas no Google ou adicione manualmente.
            </p>
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
            >
              <Plus size={16} />
              Adicionar avaliação
            </button>
          </div>

          <div className="grid gap-3">
            {reviews.length ? (
              reviews.map((review, index) => (
                <div
                  key={`${review.authorName}-${index}`}
                  className="rounded-md border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-950">
                        {review.authorName}
                      </p>
                      <p className="text-sm text-amber-500">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeReview(index)}
                      className="text-slate-400 hover:text-red-600"
                      title="Excluir avaliação"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {review.comment}
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-md border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                Nenhuma avaliação carregada. Informe o link do Google Meu
                Negócio e clique em buscar avaliações.
              </p>
            )}
          </div>
        </Section>

        <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-lg md:flex-row md:justify-end">
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard")}
            className="inline-flex h-11 items-center justify-center rounded-md border border-slate-200 px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={saveDraft}
            disabled={isSaving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-200 px-5 text-sm font-bold text-slate-700 transition hover:border-[#FF6B00] hover:text-[#FF6B00] disabled:opacity-60"
          >
            <Save size={17} />
            Salvar rascunho
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#FF6B00] px-5 text-sm font-bold text-white transition hover:bg-[#df5f03] disabled:opacity-60"
          >
            <Check size={17} />
            Salvar e publicar
          </button>
        </div>
      </form>

      {isReviewModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-black text-slate-950">
                Adicionar avaliação
              </h2>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Nome
                <input
                  value={reviewDraft.authorName}
                  onChange={(event) =>
                    setReviewDraft({
                      ...reviewDraft,
                      authorName: event.target.value,
                    })
                  }
                  className="h-11 rounded-md border border-slate-200 px-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Estrelas
                <select
                  value={reviewDraft.rating}
                  onChange={(event) =>
                    setReviewDraft({
                      ...reviewDraft,
                      rating: Number(event.target.value),
                    })
                  }
                  className="h-11 rounded-md border border-slate-200 px-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Data
                <input
                  type="date"
                  value={reviewDraft.reviewDate}
                  onChange={(event) =>
                    setReviewDraft({
                      ...reviewDraft,
                      reviewDate: event.target.value,
                    })
                  }
                  className="h-11 rounded-md border border-slate-200 px-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Texto
                <textarea
                  rows={4}
                  value={reviewDraft.comment}
                  onChange={(event) =>
                    setReviewDraft({
                      ...reviewDraft,
                      comment: event.target.value,
                    })
                  }
                  className="rounded-md border border-slate-200 px-3 py-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="h-10 rounded-md border border-slate-200 px-4 text-sm font-bold text-slate-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={addReview}
                className="h-10 rounded-md bg-[#FF6B00] px-4 text-sm font-bold text-white"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
