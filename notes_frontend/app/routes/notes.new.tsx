
import { redirect } from "@remix-run/node";
import { createNote } from "~/utils/notesStore";

// PUBLIC_INTERFACE
export async function loader() {
  /** Creates a new note and redirects to its page. */
  if (typeof document === "undefined") {
    return redirect("/");
  }
  const note = createNote({ title: "", content: "" });
  return redirect(`/notes/${note.id}`);
}

export default function NewNoteRedirect() {
  return null;
}
