export default async function WeekPage({ params }: { params: Promise<{ week: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-h2">Week: {resolvedParams.week}</h1>
      <p className="mt-4 text-slate-600">Weekly detailed data will be displayed here.</p>
    </div>
  );
}
