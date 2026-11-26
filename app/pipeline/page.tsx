import { getShortlists, isYes, toScore } from "@/lib/data";
import { Dash, PageHeader, SheetError } from "@/components/ui";

export const revalidate = 60;

const STAGES = [
  "Approved",
  "Outreach Sent",
  "Replied",
  "Interview",
  "Sent to Client",
  "Hired",
  "Rejected",
];

const norm = (s: string) => s.trim().toLowerCase();

export default async function PipelinePage() {
  const shortlists = await getShortlists();

  if (!shortlists.ok) {
    return (
      <>
        <PageHeader title="Pipeline" />
        <SheetError name="Shortlists" />
      </>
    );
  }

  const approved = shortlists.rows.filter((r) => isYes(r.approved));
  const notSelected = shortlists.rows.length - approved.length;
  const columns = STAGES.map((stage) => ({
    stage,
    cards: approved
      .filter((r) => norm(r.stage) === norm(stage))
      .sort((a, b) => (toScore(b.score) ?? -1) - (toScore(a.score) ?? -1)),
  }));

  return (
    <>
      <PageHeader
        title="Pipeline"
        subtitle="Where every approved candidate is in the hiring process."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {columns.map((c) => (
          <div key={c.stage} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-500">{c.stage}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{c.cards.length}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-gray-500">
        Not selected: {notSelected} candidate{notSelected === 1 ? "" : "s"}
      </p>

      <div className="mt-6 flex gap-3 overflow-x-auto pb-4 xl:grid xl:grid-cols-7 xl:overflow-visible">
        {columns.map((c) => (
          <div
            key={c.stage}
            className="flex w-56 shrink-0 flex-col xl:w-auto rounded-2xl border border-gray-200 bg-gray-50 p-3"
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold text-gray-800">{c.stage}</h2>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                {c.cards.length}
              </span>
            </div>
            <div className="space-y-2">
              {c.cards.length === 0 && (
                <p className="px-1 py-4 text-center text-xs text-gray-400">No one here yet</p>
              )}
              {c.cards.map((r, i) => {
                const score = toScore(r.score);
                return (
                  <div
                    key={`${r.candidate_email}-${r.role_id}-${i}`}
                    className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
                  >
                    <p className="font-medium text-gray-900">{r.name || <Dash />}</p>
                    <p className="mt-0.5 text-xs break-all text-gray-500">
                      {r.role_id || "No role"}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-indigo-700">
                      Score: {score === null ? "–" : `${Math.round(score)}/100`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
