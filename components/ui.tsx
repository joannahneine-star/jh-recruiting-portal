import { Fragment } from "react";

/** Friendly box shown when a sheet can't be loaded. */
export function SheetError({ name }: { name: string }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
      <p className="font-medium">We couldn&apos;t load the {name} sheet right now.</p>
      <p className="mt-1 text-sm">
        Please check that the sheet is still published to the web, then refresh this
        page in a minute.
      </p>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-gray-500">{subtitle}</p>}
    </div>
  );
}

export function Dash() {
  return <span className="text-gray-300">—</span>;
}

/** Shows text with its line breaks, turning *text* into bold. */
export function RichText({ text }: { text: string }) {
  if (!text) return <Dash />;
  const lines = text.split(/\r?\n/);
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {formatBold(line.replace(/^(\s*)\* /, "$1• "))}
          {i < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}

function formatBold(line: string) {
  // split on *something* (non-empty, no line break)
  const parts = line.split(/(\*[^*\n]+\*)/g);
  return parts.map((part, i) =>
    /^\*[^*\n]+\*$/.test(part) ? (
      <strong key={i} className="font-semibold text-gray-900">
        {part.slice(1, -1)}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export function CvFile({ name }: { name: string }) {
  if (!name) return <Dash />;
  return (
    <span className="inline-flex items-start gap-1 break-all text-gray-700">
      <span aria-hidden>📄</span>
      {name}
    </span>
  );
}

export function YesNoBadge({ yes }: { yes: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
        yes ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
      }`}
    >
      {yes ? "Yes" : "No"}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const s = status.trim().toLowerCase();
  let cls = "bg-gray-100 text-gray-700";
  if (s === "approved") cls = "bg-green-100 text-green-800";
  else if (s.startsWith("waiting")) cls = "bg-yellow-100 text-yellow-800";
  else if (s === "rejected") cls = "bg-red-100 text-red-800";
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
      {status || "No status"}
    </span>
  );
}

export function ScoreBar({ score }: { score: number | null }) {
  if (score === null) return <Dash />;
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${score}%` }} />
      </div>
      <span className="whitespace-nowrap text-sm tabular-nums text-gray-700">
        {Math.round(score)}
        <span className="text-gray-400">/100</span>
      </span>
    </div>
  );
}
