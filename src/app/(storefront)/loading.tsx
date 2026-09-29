import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function StorefrontLoading() {
  return (
    <div className="py-20 space-y-16">
      <Container size="default" className="text-center space-y-6">
        <Skeleton className="h-6 w-48 mx-auto" />
        <Skeleton className="h-16 w-3/4 mx-auto" />
        <Skeleton className="h-8 w-1/2 mx-auto" />
      </Container>

      <Container size="wide">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[3/4] w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
