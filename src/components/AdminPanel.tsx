import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  FolderKanban,
  LayoutDashboard,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
  Pencil,
  Plus,
  Save,
  Settings,
  ShieldCheck,
  Trash2,
  Wrench,
  X,
} from "lucide-react";

type Admin = { id: string; email: string };
type AdminRow = { id?: string | number; key?: string; [key: string]: any };
type Section = "overview" | "projects" | "experiences" | "skills" | "messages" | "settings";
type FieldType = "text" | "textarea" | "url" | "tags" | "number" | "boolean";
type Field = { name: string; label: string; type: FieldType; placeholder?: string };

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  if (response.status === 204) return undefined as T;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`);
  return body as T;
}

const fieldSets: Record<Exclude<Section, "overview" | "messages" | "settings">, Field[]> = {
  projects: [
    { name: "title", label: "Project title", type: "text", placeholder: "Project name" },
    { name: "slug", label: "URL slug", type: "text", placeholder: "project-name" },
    { name: "summary", label: "Short summary", type: "textarea" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "tech_stack", label: "Tech stack", type: "tags", placeholder: "React, TypeScript, PostgreSQL" },
    { name: "live_url", label: "Live URL", type: "url", placeholder: "https://example.com" },
    { name: "repository_url", label: "Repository URL", type: "url", placeholder: "https://github.com/..." },
    { name: "image_url", label: "Preview image URL", type: "url", placeholder: "https://..." },
    { name: "featured", label: "Feature this project", type: "boolean" },
    { name: "sort_order", label: "Display order", type: "number" },
    { name: "is_published", label: "Publish publicly", type: "boolean" },
  ],
  experiences: [
    { name: "organisation", label: "Organisation", type: "text" },
    { name: "role", label: "Role / designation", type: "text" },
    { name: "period", label: "Time period", type: "text", placeholder: "2025–Present" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "sort_order", label: "Display order", type: "number" },
    { name: "is_published", label: "Publish publicly", type: "boolean" },
  ],
  skills: [
    { name: "name", label: "Skill", type: "text", placeholder: "React" },
    { name: "category", label: "Category", type: "text", placeholder: "Development" },
    { name: "sort_order", label: "Display order", type: "number" },
    { name: "is_published", label: "Publish publicly", type: "boolean" },
  ],
};

const sectionLabels: Record<Section, string> = {
  overview: "Overview",
  projects: "Projects",
  experiences: "Experience",
  skills: "Skills",
  messages: "Inbox",
  settings: "Site settings",
};

const sectionDescriptions: Record<Section, string> = {
  overview: "A private workspace for keeping your portfolio up to date.",
  projects: "Create, edit, order and publish the projects you want visitors to see.",
  experiences: "Manage roles, volunteering and other portfolio experience.",
  skills: "Organise your skills and control which ones are visible.",
  messages: "Review messages submitted through the portfolio contact endpoint.",
  settings: "Store editable site values for future public-site integration.",
};

const navigation: { id: Section; icon: typeof LayoutDashboard }[] = [
  { id: "overview", icon: LayoutDashboard },
  { id: "projects", icon: FolderKanban },
  { id: "experiences", icon: BriefcaseBusiness },
  { id: "skills", icon: Wrench },
  { id: "messages", icon: Mail },
  { id: "settings", icon: Settings },
];

function normaliseRow(row: AdminRow, fields: Field[]) {
  const result: Record<string, string | boolean | number> = {};
  for (const field of fields) {
    const value = row[field.name];
    if (field.type === "tags") {
      result[field.name] = Array.isArray(value) ? value.join(", ") : String(value ?? "");
    } else if (field.type === "boolean") {
      result[field.name] = Boolean(value);
    } else if (field.type === "number") {
      result[field.name] = Number(value ?? 0);
    } else {
      result[field.name] = String(value ?? "");
    }
  }
  return result;
}

function defaultRow(fields: Field[], section: "projects" | "experiences" | "skills") {
  const result: Record<string, string | boolean | number> = {};
  for (const field of fields) {
    if (field.type === "boolean") result[field.name] = false;
    else if (field.type === "number") result[field.name] = 0;
    else result[field.name] = "";
  }
  // New projects and experience are drafts until explicitly published.
  if (fields.some((field) => field.name === "is_published")) result.is_published = section === "skills";
  if (fields.some((field) => field.name === "featured")) result.featured = false;
  if (fields.some((field) => field.name === "tech_stack")) result.tech_stack = "";
  return result;
}

function displayTitle(row: AdminRow, section: Section) {
  if (section === "projects") return row.title || row.slug || "Untitled project";
  if (section === "experiences") return row.role || row.organisation || "Experience";
  if (section === "skills") return row.name || "Skill";
  if (section === "messages") return row.subject || row.name || "Contact message";
  if (section === "settings") return row.key || "Setting";
  return "Record";
}

export default function AdminPanel() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [section, setSection] = useState<Section>("overview");
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState<Record<string, string | boolean | number>>({});
  const [settingKey, setSettingKey] = useState("");
  const [settingValue, setSettingValue] = useState("{}");

  useEffect(() => {
    let active = true;
    api<{ admin: Admin }>("/api/auth/me")
      .then((result) => {
        if (active) setAdmin(result.admin);
      })
      .catch(() => {
        if (active) setAdmin(null);
      })
      .finally(() => {
        if (active) setAuthChecked(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!admin || section === "overview") {
      setRows([]);
      return;
    }
    let active = true;
    const endpoint = section === "settings" ? "/api/admin/settings" : `/api/admin/${section}`;
    setLoading(true);
    setError("");
    api<{ data: AdminRow[] }>(endpoint)
      .then((result) => {
        if (active) setRows(result.data);
      })
      .catch((reason: Error) => {
        if (active) setError(reason.message || "Could not load data.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [admin, section, refreshTick]);

  const contentSection = section === "projects" || section === "experiences" || section === "skills";
  const fields = contentSection ? fieldSets[section] : [];
  const visibleCount = useMemo(
    () => rows.filter((row) => row.is_published === true).length,
    [rows],
  );

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const result = await api<{ admin: Admin }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAdmin(result.admin);
      setPassword("");
      setNotice("Signed in successfully.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    try {
      await api("/api/auth/logout", { method: "POST" });
    } catch {
      // Clear local session state even if the remote session has expired.
    }
    setAdmin(null);
    setSection("overview");
    setRows([]);
    setNotice("");
    setError("");
  }

  function openCreateEditor() {
    setError("");
    setNotice("");
    setEditingId(null);
    setFormData(defaultRow(fields, section));
    setEditorOpen(true);
  }

  function openEditEditor(row: AdminRow) {
    setError("");
    setNotice("");
    setEditingId(row.id ?? null);
    setFormData(normaliseRow(row, fields));
    setEditorOpen(true);
  }

  async function saveRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contentSection) return;
    setSubmitting(true);
    setError("");
    setNotice("");
    const payload: Record<string, unknown> = {};
    for (const field of fields) {
      const value = formData[field.name];
      if (field.type === "tags") {
        payload[field.name] = String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
      } else if (field.type === "number") {
        payload[field.name] = Number(value || 0);
      } else if (field.type === "url") {
        payload[field.name] = value ? String(value).trim() : null;
      } else {
        payload[field.name] = value;
      }
    }
    try {
      const path = `/api/admin/${section}${editingId === null ? "" : `/${editingId}`}`;
      await api(path, {
        method: editingId === null ? "POST" : "PATCH",
        body: JSON.stringify(payload),
      });
      setEditorOpen(false);
      setNotice(editingId === null ? "Record created." : "Changes saved.");
      setRefreshTick((value) => value + 1);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save this record.");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteRecord(row: AdminRow) {
    if (!row.id || !window.confirm(`Delete “${displayTitle(row, section)}”? This cannot be undone.`)) return;
    setError("");
    setNotice("");
    try {
      await api(`/api/admin/${section}/${row.id}`, { method: "DELETE" });
      setNotice("Record deleted.");
      setRefreshTick((value) => value + 1);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not delete this record.");
    }
  }

  async function updateMessage(row: AdminRow, update: { is_read?: boolean; archived?: boolean }) {
    if (!row.id) return;
    setError("");
    try {
      await api(`/api/admin/messages/${row.id}`, { method: "PATCH", body: JSON.stringify(update) });
      setNotice("Inbox updated.");
      setRefreshTick((value) => value + 1);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not update message.");
    }
  }

  async function saveSetting(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setNotice("");
    try {
      const value = JSON.parse(settingValue);
      await api(`/api/admin/settings/${encodeURIComponent(settingKey.trim())}`, {
        method: "PUT",
        body: JSON.stringify({ value }),
      });
      setNotice("Setting saved.");
      setRefreshTick((tick) => tick + 1);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Setting must contain valid JSON.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07090d] text-slate-300">
        <LoaderCircle className="animate-spin" size={24} />
        <span className="ml-3 text-sm">Checking admin session…</span>
      </div>
    );
  }

  if (!admin) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07090d] px-5 py-12 text-slate-100">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.13),transparent_52%)]" />
        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0d1118]/90 p-7 shadow-2xl shadow-black/40 sm:p-9">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-300">
              <LockKeyhole size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.23em] text-sky-300">Private workspace</p>
              <h1 className="mt-1 text-xl font-semibold tracking-tight">Ranveer<span className="text-sky-300">/</span>Admin</h1>
            </div>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">Welcome back.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">Sign in to manage your portfolio content. This area is restricted to the site administrator.</p>
          <form onSubmit={handleLogin} className="mt-7 space-y-4">
            <label className="block text-sm text-slate-300">
              Email address
              <input
                required
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-sky-400/70 focus:ring-2 focus:ring-sky-400/10"
                placeholder="you@example.com"
              />
            </label>
            <label className="block text-sm text-slate-300">
              Password
              <span className="mt-2 flex rounded-xl border border-white/10 bg-black/30 focus-within:border-sky-400/70 focus-within:ring-2 focus-within:ring-sky-400/10">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-slate-600"
                  placeholder="Enter your password"
                />
                <button type="button" onClick={() => setShowPassword((shown) => !shown)} className="px-3 text-slate-400 hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>
            {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 py-2.5 text-sm text-rose-200">{error}</p>}
            <button disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-sky-200 disabled:cursor-wait disabled:opacity-60">
              {submitting ? <LoaderCircle size={18} className="animate-spin" /> : <LockKeyhole size={17} />}
              {submitting ? "Signing in…" : "Sign in securely"}
            </button>
          </form>
          <div className="mt-6 flex items-center gap-2 border-t border-white/8 pt-5 text-xs leading-5 text-slate-500">
            <ShieldCheck size={15} className="shrink-0 text-emerald-300" />
            Protected by server-side authentication and session cookies.
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#080a0e] text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-white/[0.07] bg-[#0a0d12] p-5 md:flex md:flex-col">
          <a href="/admin" className="flex items-center gap-3 px-2 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 font-bold text-sky-300">R.</span>
            <span>
              <span className="block text-sm font-semibold">Ranveer Singh</span>
              <span className="mt-0.5 block text-xs text-slate-500">Portfolio admin</span>
            </span>
          </a>
          <div className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">Workspace</div>
          <nav className="space-y-1">
            {navigation.map(({ id, icon: Icon }) => (
              <button key={id} onClick={() => { setSection(id); setEditorOpen(false); setError(""); setNotice(""); }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${section === id ? "border border-sky-300/15 bg-sky-300/10 text-sky-200" : "text-slate-400 hover:bg-white/[0.04] hover:text-white"}`}>
                <Icon size={17} />
                <span className="flex-1">{sectionLabels[id]}</span>
                {section === id && <ChevronRight size={15} />}
              </button>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Signed in</div>
            <p className="mt-2 truncate text-xs text-slate-400" title={admin.email}>{admin.email}</p>
            <button onClick={handleLogout} className="mt-4 flex items-center gap-2 text-xs text-slate-500 transition hover:text-white"><LogOut size={14} /> Sign out</button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.07] bg-[#080a0e]/90 px-5 py-4 backdrop-blur-xl sm:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-sky-200 md:hidden"><LayoutDashboard size={18} /></span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{sectionLabels[section]}</p>
                <p className="hidden text-xs text-slate-500 sm:block">Portfolio management / {sectionLabels[section]}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href="/" target="_blank" rel="noreferrer" className="hidden items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:border-white/20 hover:text-white sm:flex">View portfolio <ArrowUpRight size={14} /></a>
              <button onClick={handleLogout} title="Sign out" className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-white md:hidden"><LogOut size={16} /></button>
            </div>
          </header>

          <div className="border-b border-white/[0.06] px-4 py-2 md:hidden">
            <nav className="flex gap-1 overflow-x-auto">
              {navigation.map(({ id, icon: Icon }) => (
                <button key={id} onClick={() => { setSection(id); setEditorOpen(false); setError(""); setNotice(""); }} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs ${section === id ? "bg-sky-300/10 text-sky-200" : "text-slate-400"}`}>
                  <Icon size={15} /> {sectionLabels[id]}
                </button>
              ))}
            </nav>
          </div>

          <div className="mx-auto max-w-6xl p-5 sm:p-8 lg:p-10">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">Admin console</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">{section === "overview" ? "Your portfolio, under control." : sectionLabels[section]}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{sectionDescriptions[section]}</p>
              </div>
              {contentSection && !editorOpen && (
                <button onClick={openCreateEditor} className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-200"><Plus size={17} /> Add {section === "projects" ? "project" : section === "skills" ? "skill" : "experience"}</button>
              )}
              {section === "settings" && (
                <button onClick={() => { setSettingKey(""); setSettingValue("{}"); }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/[0.04]"><Plus size={16} /> New setting</button>
              )}
            </div>

            {error && <div role="alert" className="mt-6 flex items-start gap-2 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] px-4 py-3 text-sm text-rose-200"><X size={16} className="mt-0.5 shrink-0" /> <span>{error}</span></div>}
            {notice && <div className="mt-6 flex items-start gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3 text-sm text-emerald-200"><Check size={16} className="mt-0.5 shrink-0" /> <span>{notice}</span></div>}

            {section === "overview" && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  { label: "Projects", count: "Manage", description: "Showcase work, links and technology stacks.", icon: FolderKanban, target: "projects" as Section },
                  { label: "Experience", count: "Manage", description: "Keep roles, volunteering and contributions current.", icon: BriefcaseBusiness, target: "experiences" as Section },
                  { label: "Skills", count: "Manage", description: "Organise your technical and professional skills.", icon: Wrench, target: "skills" as Section },
                ].map((item) => (
                  <button key={item.target} onClick={() => setSection(item.target)} className="group rounded-2xl border border-white/[0.08] bg-[#0d1118] p-5 text-left transition hover:-translate-y-0.5 hover:border-sky-300/25 hover:bg-[#101722]">
                    <div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-300/10 text-sky-200"><item.icon size={19} /></span><ArrowUpRight size={17} className="text-slate-600 transition group-hover:text-sky-200" /></div>
                    <p className="mt-5 text-lg font-semibold">{item.label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                    <p className="mt-5 text-xs font-semibold text-sky-200">{item.count} content <ChevronRight className="ml-1 inline" size={14} /></p>
                  </button>
                ))}
                <div className="rounded-2xl border border-white/[0.08] bg-[#0d1118] p-5 sm:col-span-2 xl:col-span-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-200"><ShieldCheck size={19} /></span>
                    <div>
                      <h2 className="font-semibold">Admin API foundation</h2>
                      <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-400">Your admin service stores editable content in PostgreSQL. Public portfolio sections still use their existing local data until we connect them in the next integration step. Publish changes only after that connection is verified.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {editorOpen && contentSection && (
              <form onSubmit={saveRecord} className="mt-7 rounded-2xl border border-white/[0.08] bg-[#0d1118] p-5 sm:p-7">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div><h2 className="text-lg font-semibold">{editingId === null ? "Create new record" : "Edit record"}</h2><p className="mt-1 text-xs text-slate-500">Fields marked by the form are validated by the API before saving.</p></div>
                  <button type="button" onClick={() => setEditorOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white" aria-label="Close editor"><X size={18} /></button>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {fields.map((field) => (
                    <label key={field.name} className={`block text-sm text-slate-300 ${field.type === "textarea" ? "md:col-span-2" : ""} ${field.type === "boolean" ? "flex items-center justify-between rounded-xl border border-white/[0.07] px-4 py-3" : ""}`}>
                      <span>{field.label}</span>
                      {field.type === "boolean" ? (
                        <input type="checkbox" checked={Boolean(formData[field.name])} onChange={(event) => setFormData((data) => ({ ...data, [field.name]: event.target.checked }))} className="h-4 w-4 accent-sky-300" />
                      ) : field.type === "textarea" ? (
                        <textarea value={String(formData[field.name] ?? "")} onChange={(event) => setFormData((data) => ({ ...data, [field.name]: event.target.value }))} rows={4} className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/25 px-3.5 py-3 text-sm text-slate-100 outline-none focus:border-sky-300/60" placeholder={field.placeholder} />
                      ) : (
                        <input type={field.type === "number" ? "number" : field.type === "url" ? "url" : "text"} value={String(formData[field.name] ?? "")} onChange={(event) => setFormData((data) => ({ ...data, [field.name]: field.type === "number" ? Number(event.target.value) : event.target.value }))} className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-3.5 py-3 text-sm text-slate-100 outline-none focus:border-sky-300/60" placeholder={field.placeholder} />
                      )}
                      {field.type === "tags" && <span className="mt-1 block text-[11px] text-slate-500">Separate items with commas.</span>}
                    </label>
                  ))}
                </div>
                <div className="mt-7 flex flex-wrap gap-3 border-t border-white/[0.07] pt-5">
                  <button disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-sky-300 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-sky-200 disabled:opacity-50"><Save size={16} /> {submitting ? "Saving…" : "Save record"}</button>
                  <button type="button" onClick={() => setEditorOpen(false)} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/[0.04]">Cancel</button>
                </div>
              </form>
            )}

            {contentSection && !editorOpen && (
              <div className="mt-7 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1118]">
                <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
                  <div><h2 className="text-sm font-semibold">All {sectionLabels[section].toLowerCase()}</h2><p className="mt-1 text-xs text-slate-500">{rows.length} total · {visibleCount} published</p></div>
                  <button onClick={() => setRefreshTick((tick) => tick + 1)} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5">Refresh</button>
                </div>
                {loading ? <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-400"><LoaderCircle className="animate-spin" size={18} /> Loading records…</div> :
                  rows.length === 0 ? <div className="px-6 py-14 text-center"><p className="font-medium text-slate-200">Nothing here yet</p><p className="mt-2 text-sm text-slate-500">Add your first record to get started.</p><button onClick={openCreateEditor} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-sky-300 px-3.5 py-2 text-sm font-semibold text-slate-950"><Plus size={15} /> Add record</button></div> :
                  <div className="divide-y divide-white/[0.06]">
                    {rows.map((row) => (
                      <div key={row.id} className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-medium text-slate-100">{displayTitle(row, section)}</p>
                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${row.is_published ? "bg-emerald-300/10 text-emerald-200" : "bg-amber-300/10 text-amber-200"}`}>{row.is_published ? "Published" : "Draft"}</span>
                            {section === "projects" && row.featured && <span className="rounded-md bg-sky-300/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-200">Featured</span>}
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{row.summary || row.description || row.category || row.period || row.slug || "—"}</p>
                          <p className="mt-1 text-[11px] text-slate-600">ID {row.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditEditor(row)} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:border-sky-300/25 hover:text-sky-200"><Pencil size={14} /> Edit</button>
                          <button onClick={() => deleteRecord(row)} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300/10 px-3 py-2 text-xs text-rose-200/80 transition hover:border-rose-300/30 hover:bg-rose-300/5 hover:text-rose-100"><Trash2 size={14} /> Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                }
              </div>
            )}

            {section === "messages" && (
              <div className="mt-7 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1118]">
                <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4"><div><h2 className="text-sm font-semibold">Contact inbox</h2><p className="mt-1 text-xs text-slate-500">Messages sent to the API contact endpoint.</p></div><button onClick={() => setRefreshTick((tick) => tick + 1)} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5">Refresh</button></div>
                {loading ? <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-400"><LoaderCircle className="animate-spin" size={18} /> Loading messages…</div> :
                  rows.length === 0 ? <div className="px-6 py-14 text-center"><Mail className="mx-auto text-slate-600" size={24} /><p className="mt-3 font-medium">Inbox is empty</p><p className="mt-1 text-sm text-slate-500">New submissions will appear here after the contact form is connected to the API.</p></div> :
                  <div className="divide-y divide-white/[0.06]">{rows.map((row) => (
                    <article key={row.id} className="px-5 py-5">
                      <div className="flex flex-col justify-between gap-3 sm:flex-row">
                        <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-semibold">{displayTitle(row, section)}</h3><span className={`rounded-md px-2 py-0.5 text-[10px] uppercase ${row.is_read ? "bg-white/5 text-slate-500" : "bg-sky-300/10 text-sky-200"}`}>{row.is_read ? "Read" : "Unread"}</span>{row.archived_at && <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] uppercase text-slate-500">Archived</span>}</div><p className="mt-1 text-xs text-sky-200">{row.email}</p><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">{row.message}</p><p className="mt-3 text-[11px] text-slate-600">{row.created_at ? new Date(row.created_at).toLocaleString() : ""}</p></div>
                        <div className="flex shrink-0 flex-wrap items-start gap-2"><button onClick={() => updateMessage(row, { is_read: !row.is_read })} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5">{row.is_read ? "Mark unread" : "Mark read"}</button><button onClick={() => updateMessage(row, { archived: !row.archived_at })} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5">{row.archived_at ? "Unarchive" : "Archive"}</button></div>
                      </div>
                    </article>
                  ))}</div>
                }
              </div>
            )}

            {section === "settings" && (
              <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1118]">
                  <div className="border-b border-white/[0.07] px-5 py-4"><h2 className="text-sm font-semibold">Saved settings</h2><p className="mt-1 text-xs text-slate-500">JSON values are stored in PostgreSQL.</p></div>
                  {loading ? <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-400"><LoaderCircle className="animate-spin" size={18} /> Loading settings…</div> :
                    rows.length === 0 ? <p className="px-5 py-10 text-center text-sm text-slate-500">No settings saved yet.</p> :
                    <div className="divide-y divide-white/[0.06]">{rows.map((row) => <button key={row.key} onClick={() => { setSettingKey(String(row.key)); setSettingValue(JSON.stringify(row.value, null, 2)); }} className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left hover:bg-white/[0.025]"><span className="min-w-0"><span className="block text-sm font-medium text-slate-200">{row.key}</span><span className="mt-1 block max-w-xl truncate font-mono text-xs text-slate-500">{JSON.stringify(row.value)}</span></span><Pencil size={15} className="mt-1 shrink-0 text-slate-500" /></button>)}</div>
                  }
                </div>
                <form onSubmit={saveSetting} className="rounded-2xl border border-white/[0.08] bg-[#0d1118] p-5">
                  <h2 className="text-sm font-semibold">{settingKey ? "Edit setting" : "Add a setting"}</h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Use a public content value only. Never store passwords, API keys or database credentials here.</p>
                  <label className="mt-5 block text-sm text-slate-300">Key<input required pattern="[a-z][a-z0-9_-]{0,63}" value={settingKey} onChange={(event) => setSettingKey(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-3.5 py-3 text-sm outline-none focus:border-sky-300/60" placeholder="hero_tagline" /></label>
                  <label className="mt-4 block text-sm text-slate-300">Value (JSON)<textarea required rows={7} value={settingValue} onChange={(event) => setSettingValue(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-3.5 py-3 font-mono text-xs leading-5 outline-none focus:border-sky-300/60" /></label>
                  <button disabled={submitting || !settingKey.trim()} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-300 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-sky-200 disabled:opacity-50"><Save size={15} /> {submitting ? "Saving…" : "Save setting"}</button>
                  <button type="button" onClick={() => { setSettingKey(""); setSettingValue("{}"); }} className="mt-2 w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/[0.04]">Clear form</button>
                </form>
              </div>
            )}

            <footer className="mt-10 flex flex-col gap-2 border-t border-white/[0.06] pt-5 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
              <span>Ranveer Singh · Portfolio admin</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={13} /> Private workspace</span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
