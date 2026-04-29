export default async function KeywordPage({ params }: { params: Promise<{ keyword: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-h2">Keyword: {resolvedParams.keyword}</h1>
      <p className="mt-4 text-slate-600">Keyword specific details will be displayed here.</p>
    </div>
  );
}
