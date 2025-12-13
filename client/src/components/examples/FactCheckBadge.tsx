import { FactCheckBadge } from "../FactCheckBadge";

export default function FactCheckBadgeExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <FactCheckBadge status="verified" sources={["NASA", "ESA"]} />
      <FactCheckBadge status="disputed" sources={["Source conflicts"]} />
      <FactCheckBadge status="checking" />
      <FactCheckBadge status="inconclusive" />
    </div>
  );
}
