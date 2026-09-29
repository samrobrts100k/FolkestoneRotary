"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { createAdminClient, createSessionClient } from "@/lib/supabase/server";
import { buildRow } from "@/lib/admin/build-row";
import { fundingStatuses, getResource } from "@/lib/admin/resources";
import { isRole, canManage } from "@/lib/permissions";

export interface SaveState { errors?: Record<string, string>; message?: string }

const refresh = () => revalidatePath("/", "layout");

/** Create or update a record. Role is checked here AND by Supabase row-level security. */
export async function saveRecord(key: string, id: string, _: SaveState, fd: FormData): Promise<SaveState> {
  const res = getResource(key);
  if (!res) return { message: "Unknown content type." };
  await requireStaff(key);
  const built = buildRow(res, fd);
  if (!built.ok) return { errors: built.errors, message: "Please fix the highlighted fields." };
  const sb = await createSessionClient();
  const q = id === "new" ? sb.from(res.table).insert(built.row) : sb.from(res.table).update(built.row).eq("id", id);
  const { error } = await q;
  if (error) return { message: error.code === "23505" ? "That URL slug is already used — choose another." : `Couldn't save: ${error.message}` };
  refresh();
  redirect(`/admin/${key}?saved=1`);
}

export async function deleteRecord(key: string, id: string) {
  const res = getResource(key);
  if (!res) return;
  await requireStaff(key);
  await (await createSessionClient()).from(res.table).delete().eq("id", id);
  refresh();
  redirect(`/admin/${key}?deleted=1`);
}

export async function updateEnquiryStatus(key: string, id: string, fd: FormData) {
  const res = getResource(key);
  if (!res?.readonly) return;
  await requireStaff(key);
  const status = String(fd.get("status") ?? "");
  const allowed = res.fields.find((f) => f.name === "status")?.options?.map((o) => o.value) ?? [];
  if (!allowed.includes(status)) return;
  await (await createSessionClient()).from(res.table).update({ status }).eq("id", id);
  revalidatePath(`/admin/${key}`);
}

export async function updateFunding(id: string, fd: FormData) {
  const s = await requireStaff("funding_applications");
  const status = String(fd.get("status") ?? "");
  if (!fundingStatuses.some((x) => x.value === status)) return;
  await (await createSessionClient()).from("funding_applications").update({ status, reviewer_notes: String(fd.get("reviewer_notes") ?? "").slice(0, 4000), reviewed_by: s.userId }).eq("id", id);
  revalidatePath("/admin/funding");
  redirect("/admin/funding?saved=1");
}

export async function updateUser(id: string, fd: FormData) {
  await requireStaff("profiles");
  const role = String(fd.get("role"));
  if (!isRole(role)) return;
  await (await createSessionClient()).from("profiles").update({
    role, is_active: fd.get("is_active") === "on", club_role: String(fd.get("club_role") ?? "").trim() || null,
    full_name: String(fd.get("full_name") ?? "").trim(), phone: String(fd.get("phone") ?? "").trim() || null,
  }).eq("id", id);
  revalidatePath("/admin/users");
}

export async function inviteUser(_: SaveState, fd: FormData): Promise<SaveState> {
  await requireStaff("profiles");
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { errors: { email: "Enter a valid email" } };
  const { error } = await createAdminClient().auth.admin.inviteUserByEmail(email, { data: { full_name: String(fd.get("full_name") ?? "") } });
  if (error) return { message: `Couldn't send invite: ${error.message}` };
  return { message: `Invitation sent to ${email}. Once they set a password, activate them below.` };
}

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const FILE_TYPES = [...IMAGE_TYPES, "application/pdf"];
/** Uploads to Supabase Storage (public bucket) and records it in the media table. */
export async function uploadMedia(fd: FormData): Promise<{ url?: string; error?: string }> {
  const s = await requireStaff();
  if (!canManage(s.role, "media")) return { error: "You don't have permission to upload." };
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a file." };
  const isPdf = file.type === "application/pdf";
  if (!(isPdf ? FILE_TYPES : IMAGE_TYPES).includes(file.type)) return { error: "Only JPG, PNG, WebP images or PDFs are allowed." };
  if (file.size > 10 * 1024 * 1024) return { error: "File is larger than 10MB." };
  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
  const sb = await createSessionClient();
  const bucket = isPdf ? "documents" : "media";
  const { error } = await sb.storage.from(bucket).upload(path, file, { contentType: file.type });
  if (error) return { error: `Upload failed: ${error.message}` };
  const url = sb.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  await sb.from("media").insert({ storage_path: `${bucket}/${path}`, url, alt: String(fd.get("alt") ?? ""), caption: String(fd.get("caption") ?? "") || null, mime_type: file.type, size_bytes: file.size, uploaded_by: s.userId });
  return { url };
}

export async function deleteMedia(id: string) {
  await requireStaff("media");
  const sb = await createSessionClient();
  const { data } = await sb.from("media").select("storage_path").eq("id", id).maybeSingle();
  if (data) { const [bucket, ...rest] = data.storage_path.split("/"); await sb.storage.from(bucket).remove([rest.join("/")]); await sb.from("media").delete().eq("id", id); }
  revalidatePath("/admin/media");
}
