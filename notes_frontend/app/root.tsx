import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import type { ActionFunctionArgs, LinksFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import Sidebar from "~/components/Sidebar";
import "./tailwind.css";
import { createNote, listNotes } from "./utils/notesStore";

// PUBLIC_INTERFACE
export async function loader() {
  /**
   * Root loader: supplies the list of notes for the sidebar.
   * Runs client-side (localStorage) after hydration; returns empty list on server.
   */
  // On the server, localStorage is unavailable; return empty state for shell.
  if (typeof document === "undefined") {
    return json({ notes: [] as ReturnType<typeof listNotes> });
  }
  return json({ notes: listNotes() });
}

// PUBLIC_INTERFACE
export async function action({ request }: ActionFunctionArgs) {
  /**
   * Root action: supports creating a new note from the sidebar New button.
   * Uses client-side storage after hydration. On server, falls back to redirect.
   */
  const form = await request.formData();
  const intent = String(form.get("_intent") || "");
  if (intent === "create") {
    // On server, cannot access localStorage; we return to index and let client loader refresh.
    if (typeof document === "undefined") {
      return redirect("/");
    }
    const note = createNote({ title: "", content: "" });
    return redirect(`/notes/${note.id}`);
  }
  return redirect("/");
}

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const nav = useNavigation();
  const isBusy = nav.state !== "idle";

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-[#f9fafb] text-[#111827] antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
        {isBusy ? (
          <div
            aria-live="polite"
            className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0"
          >
            <div className="mx-auto h-0.5 w-3/4 max-w-4xl bg-gradient-to-r from-blue-500 to-amber-400 animate-pulse" />
          </div>
        ) : null}
      </body>
    </html>
  );
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="flex h-screen">
      <div className="w-80 shrink-0 shadow-sm">
        <Sidebar notes={data.notes ?? []} />
      </div>
      <main className="flex-1 bg-white shadow-inner">
        <Outlet />
      </main>
    </div>
  );
}
