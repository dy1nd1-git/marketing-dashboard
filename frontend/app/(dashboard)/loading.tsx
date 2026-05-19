import { LoadingSpinner } from "../../src/components/dashboard/LoadingSpinner";

export default function Loading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
