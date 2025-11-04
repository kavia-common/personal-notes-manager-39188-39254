import { Link, useNavigate, useNavigation, Form } from "@remix-run/react";
import type { Note } from "~/utils/notesStore";

type Props = {
  notes: Note[];
  selectedId?: string;
};

export default function Sidebar({ notes, selectedId }: Props) {
  const navigate = useNavigate();
  const nav = useNavigation();
  const isSubmitting = nav.state === "submitting" || nav.state === "loading";

  return (
    <aside
      className="flex h-full w-full max-w-80 flex-col border-r border-slate-200 bg-white/90 backdrop-blur-sm"
      aria-label="Notes Sidebar"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div className="flex flex-col">
          <span className="text-sm text-slate-500">Personal</span>
          <h2 className="text-lg font-semibold text-slate-900">Notes</h2>
        </div>
        <Form
          method="post"
          action="/"
          replace
        >
          <input type="hidden" name="_intent" value="create" />
          <button
            type="submit"
            data-testid="new-note-button"
            disabled={isSubmitting}
            className="inline-flex items-center rounded-md bg-[#2563EB] px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563EB]"
            title="New note"
          >
            + New
          </button>
        </Form>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="p-4 text-sm text-slate-500">No notes yet. Create your first note.</p>
        ) : (
          <ul className="p-2 space-y-1" data-testid="notes-list">
            {notes.map((n) => {
              const active = n.id === selectedId;
              return (
                <li key={n.id}>
                  <Link
                    to={`/notes/${n.id}`}
                    prefetch="intent"
                    className={`group block rounded-md px-3 py-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      active
                        ? "bg-blue-50 text-slate-900 ring-1 ring-blue-200"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate font-medium">{n.title || "Untitled"}</span>
                      <span className="ml-2 shrink-0 text-xs text-slate-400">
                        {new Date(n.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {n.content ? (
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                        {n.content}
                      </p>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="px-4 py-3 border-t border-slate-200">
        <button
          onClick={() => navigate(0)}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-300"
        >
          Refresh
        </button>
      </div>
    </aside>
  );
}
