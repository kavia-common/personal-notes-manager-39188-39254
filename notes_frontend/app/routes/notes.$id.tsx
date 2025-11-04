import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import NoteEditor from "~/components/NoteEditor";
import { deleteNote, getNote, updateNote } from "~/utils/notesStore";

// PUBLIC_INTERFACE
export async function loader({ params }: LoaderFunctionArgs) {
  /** Loads a single note by id for viewing/editing. */
  const id = params.id!;
  if (typeof document === "undefined") {
    // server render: cannot access localStorage; return null
    return json<{ note: import("~/utils/notesStore").Note | null }>({ note: null });
  }
  const note = getNote(id);
  return json({ note });
}

// PUBLIC_INTERFACE
export async function action({ request, params }: ActionFunctionArgs) {
  /** Supports save and delete actions for a note. */
  const id = params.id!;
  const form = await request.formData();
  const intent = String(form.get("_intent") || "");
  if (typeof document === "undefined") {
    // SSR fallback: just go back to the note page; client will handle after hydration
    return redirect(`/notes/${id}`);
  }
  switch (intent) {
    case "save": {
      const title = String(form.get("title") ?? "");
      const content = String(form.get("content") ?? "");
      updateNote(id, { title, content });
      return redirect(`/notes/${id}`);
    }
    case "delete": {
      deleteNote(id);
      return redirect("/");
    }
    default:
      return redirect(`/notes/${id}`);
  }
}

export default function NoteDetailRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="h-full">
      <NoteEditor note={data.note} mode="edit" allowDelete />
    </div>
  );
}
