export function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
        </div>
        <h2 className="text-xl font-semibold text-slate-900">Loading...</h2>
        <p className="text-sm text-slate-600">Preparing your task</p>
      </div>
    </div>
  );
}
