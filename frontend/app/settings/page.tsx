import { Sidebar } from "../../src/components/layout/Sidebar";

export default function SettingsPage() {
  return (
    <>
      <Sidebar />
      <main className="ml-64 min-h-screen flex flex-col">
        <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <h1 className="text-h2 mb-6">Settings</h1>
          <p className="text-slate-600">
            Account and integrations settings go here.
          </p>
        </div>
      </main>
    </>
  );
}
