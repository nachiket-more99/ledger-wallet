import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils"; 

interface LoaderProps {
  className?: string;
}

export function Loader({ className }: LoaderProps) {
  return (
    <div className={cn("fixed inset-0 flex items-center justify-center bg-background", className)}>
      <Spinner className="size-7 text-primary" />
    </div>
  );
}