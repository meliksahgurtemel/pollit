export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-zinc-800 border-t-yellow-500 rounded-full animate-spin" />
      <p className="mt-4 text-zinc-400">Loading...</p>
    </div>
  );
}