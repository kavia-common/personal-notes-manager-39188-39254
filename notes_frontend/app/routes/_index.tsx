import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Personal Notes" },
    { name: "description", content: "Create and manage personal notes." },
  ];
};

export default function Index() {
  return (
    <div className="flex h-full items-center justify-center bg-white">
      <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-3 h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-gray-50 ring-1 ring-blue-100 flex items-center justify-center">
          <span className="text-blue-600">🌊</span>
        </div>
        <h2 className="text-xl font-semibold text-slate-900">Welcome to Personal Notes</h2>
        <p className="mt-2 text-sm text-slate-600">
          Use the “New” button in the sidebar to create your first note.
        </p>
      </div>
    </div>
  );
}
