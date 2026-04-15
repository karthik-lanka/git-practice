export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-neutral-200"></div>
          <div className="absolute inset-0 rounded-full border-2 border-t-neutral-900 animate-spin"></div>
        </div>
        <p className="text-sm text-neutral-400 tracking-widest uppercase">
          Loading
        </p>
      </div>
    </div>
  );
}
