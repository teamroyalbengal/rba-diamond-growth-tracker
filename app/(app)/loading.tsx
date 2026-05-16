import { LoadingState } from "@/components/ui/loading-state";

export default function AppLoading() {
  return (
    <div className="mx-auto max-w-3xl">
      <LoadingState label="Loading Diamond growth data..." />
    </div>
  );
}
