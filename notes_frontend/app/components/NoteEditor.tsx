import { Form, useNavigation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import type { Note } from "~/utils/notesStore";

type Props = {
  note: Note | null;
  mode: "view" | "create" | "edit"; // informative only
  allowDelete?: boolean;
};

export default function NoteEditor({ note, mode, allowDelete = true }: Props) {
  const nav = useNavigation();
  const isSubmitting = nav.state === "submitting";
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(note?.title ?? "");
  }, [note?.title]);

  useEffect(() => {
    setContent(note?.content ?? "");
  }, [note?.content]);

  useEffect(() => {
    if (mode === "create" && titleRef.current) {
      titleRef.current.focus();
    }
  }, [mode]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-500/10 to-gray-50 ring-1 ring-blue-100 flex items-center justify-center">
            <span className="text-blue-600">📝</span>
          </div>
          <h1 className="text-base font-semibold text-slate-900">
            {mode === "create" ? "New Note" : note?.title || "Untitled"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {allowDelete && note ? (
            <Form method="post" replace>
              <input type="hidden" name="_intent" value="delete" />
              <input type="hidden" name="id" value={note.id} />
              <button
                type="submit"
                className="rounded-md border border-red-200 bg-white px-3 py-2 text-sm text-red-600 shadow-sm transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                title="Delete note"
                data-testid="delete-note-button"
              >
                Delete
              </button>
            </Form>
          ) : null}
          <Form method="post" replace>
            <input type="hidden" name="_intent" value="save" />
            {note?.id ? <input type="hidden" name="id" value={note.id} /> : null}
            <input type="hidden" name="title" value={title} />
            <input type="hidden" name="content" value={content} />
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-[#2563EB] px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563EB]"
              data-testid="save-note-button"
              title="Save note"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </Form>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="mx-auto max-w-3xl space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Title
            <input
              ref={titleRef}
              data-testid="note-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-200"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Content
            <textarea
              data-testid="note-content-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your note..."
              rows={16}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-200"
            />
          </label>

          {note?.updatedAt ? (
            <p className="text-xs text-slate-500">
              Last updated: {new Date(note.updatedAt).toLocaleString()}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
