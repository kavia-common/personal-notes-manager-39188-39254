export type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: number; // epoch ms
};

const STORAGE_KEY = "pnm.notes.v1";

// Try/catch wrapper to avoid throwing in SSR or when storage not available
function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function loadAll(): Note[] {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Note[];
    // validate basic structure
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (n) =>
          n &&
          typeof n.id === "string" &&
          typeof n.title === "string" &&
          typeof n.content === "string" &&
          typeof n.updatedAt === "number"
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

function saveAll(notes: Note[]) {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // ignore quota or serialization errors
  }
}

// PUBLIC_INTERFACE
export function listNotes(): Note[] {
  /** Returns a list of notes sorted by most recently updated. */
  return loadAll();
}

// PUBLIC_INTERFACE
export function getNote(id: string): Note | null {
  /** Gets a single note by id or null if not found. */
  return loadAll().find((n) => n.id === id) ?? null;
}

// PUBLIC_INTERFACE
export function createNote(partial?: Partial<Pick<Note, "title" | "content">>): Note {
  /** Creates a new note with optional title/content and returns it. */
  const now = Date.now();
  const newNote: Note = {
    id: cryptoRandomId(),
    title: (partial?.title ?? "").trim(),
    content: partial?.content ?? "",
    updatedAt: now,
  };
  const notes = loadAll();
  notes.unshift(newNote);
  saveAll(notes);
  return newNote;
}

// PUBLIC_INTERFACE
export function updateNote(id: string, data: Partial<Pick<Note, "title" | "content">>): Note | null {
  /** Updates an existing note; returns updated note or null if not found. */
  const notes = loadAll();
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) return null;
  const now = Date.now();
  const updated: Note = {
    ...notes[idx],
    title: data.title !== undefined ? data.title : notes[idx].title,
    content: data.content !== undefined ? data.content : notes[idx].content,
    updatedAt: now,
  };
  // Move to front due to update recency
  notes.splice(idx, 1);
  notes.unshift(updated);
  saveAll(notes);
  return updated;
}

// PUBLIC_INTERFACE
export function deleteNote(id: string): boolean {
  /** Deletes a note by id; returns true if deleted. */
  const notes = loadAll();
  const filtered = notes.filter((n) => n.id !== id);
  if (filtered.length === notes.length) return false;
  saveAll(filtered);
  return true;
}

// PUBLIC_INTERFACE
export function safeEnv(): Record<string, string | undefined> {
  /** Safely reads known VITE_* env flags on client if present. */
  if (typeof window === "undefined") return {};
  const env: Record<string, string | undefined> = {};
  // Access via import.meta.env is safe at build time, but keep optional.
  try {
    const e: Record<string, string | undefined> =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((import.meta as unknown as { env?: Record<string, string | undefined> }).env) ?? {};
    const keys = [
      "VITE_API_BASE",
      "VITE_BACKEND_URL",
      "VITE_FRONTEND_URL",
      "VITE_WS_URL",
      "VITE_NODE_ENV",
      "VITE_ENABLE_SOURCE_MAPS",
      "VITE_PORT",
      "VITE_TRUST_PROXY",
      "VITE_LOG_LEVEL",
      "VITE_HEALTHCHECK_PATH",
      "VITE_FEATURE_FLAGS",
      "VITE_EXPERIMENTS_ENABLED",
    ];
    for (const k of keys) env[k] = e[k];
  } catch {
    // ignore
  }
  return env;
}

function cryptoRandomId(): string {
  const c = (typeof globalThis !== "undefined" ? (globalThis as unknown as { crypto?: Crypto }).crypto : undefined);
  if (c && "randomUUID" in c) {
    // @ts-expect-error randomUUID is available in modern runtimes
    return c.randomUUID();
  }
  // Simple fallback if randomUUID not available
  return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
