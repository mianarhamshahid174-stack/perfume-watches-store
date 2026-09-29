import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-zinc-800" />
          <Skeleton className="h-4 w-96 bg-zinc-900" />
        </div>
        <Skeleton className="h-9 w-32 bg-zinc-800" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg bg-zinc-900 border-zinc-800" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-72 rounded-lg bg-zinc-900 border-zinc-800" />
        <Skeleton className="h-72 rounded-lg bg-zinc-900 border-zinc-800" />
      </div>
    </div>
  );
}
