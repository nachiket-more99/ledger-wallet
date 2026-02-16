
import { Spinner } from "@/components/ui/spinner"

export function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <Spinner className="size-7 text-primary" />
    </div>
  );
}
