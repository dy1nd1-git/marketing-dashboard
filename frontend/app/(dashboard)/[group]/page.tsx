export default async function GroupPage({ params }: { params: Promise<{ group: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-h2">Ad Group: {resolvedParams.group}</h1>
      <p className="mt-4 text-slate-600">Ad group specific details will be displayed here.</p>
    </div>
  );
}
