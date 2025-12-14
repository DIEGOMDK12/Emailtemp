import { EmptyState } from "../EmptyState";

export default function EmptyStateExample() {
  return (
    <div className="h-96 border rounded-md">
      <EmptyState onCopyEmail={() => console.log("Copy email triggered")} />
    </div>
  );
}
