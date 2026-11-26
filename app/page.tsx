import { getRoles, getShortlists, isYes, toScore, type ShortlistRow } from "@/lib/data";
import {
  CvFile,
  Dash,
  PageHeader,
  RichText,
  ScoreBar,
  SheetError,
  StatusBadge,
  YesNoBadge,
} from "@/components/ui";

export const revalidate = 60;

export default async function OpenRolesPage() {
  const [roles, shortlists] = await Promise.all([getRoles(), getShortlists()]);

  return (
    <>
      <PageHeader
        title="Open Roles"
        subtitle="Every role we are recruiting for, with its shortlist of best-matching candidates."
      />

      {!roles.ok ? (
        <SheetError name="Roles" />
      ) : roles.rows.length === 0 ? (
        <p className="rounded-2xl bg-gray-50 p-6 text-gray-500">No roles yet.</p>
      ) : (
        <div className="space-y-6">
          {!shortlists.ok && <SheetError name="Shortlists" />}
          {roles.rows.map((role, i) => {
            const list = shortlists.rows
              .filter((s) => s.role_id === role.role_id)
              .sort((a, b) => (toScore(b.score) ?? -1) - (toScore(a.score) ?? -1));
            return (
              <section
                key={`${role.role_id}-${i}`}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600">
                      {role.client || "Unknown client"}
                    </p>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {role.title || role.role_id || "Untitled role"}
                    </h2>
                  </div>
                  <div className="flex flex-col items-start gap-1 sm:items-end">
                    <StatusBadge status={role.status} />
                    {role.approved_at && (
                      <span className="text-xs text-gray-500">
                        Approved at {role.approved_at}
                      </span>
                    )}
                  </div>
                </div>

                <details className="group mt-4 rounded-xl border border-gray-200 bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-medium text-gray-800 select-none">
                    Job description
                    <svg
                      aria-hidden
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </summary>
                  <div className="border-t border-gray-100 px-4 py-4 text-sm leading-relaxed text-gray-700">
                    <RichText text={role.job_description} />
                  </div>
                </details>

                <h3 className="mt-6 mb-2 font-semibold text-gray-900">Shortlist</h3>
                {list.length === 0 ? (
                  <p className="rounded-xl bg-white p-4 text-sm text-gray-500">
                    No shortlist yet
                  </p>
                ) : (
                  <ShortlistTable rows={list} />
                )}
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}

function ShortlistTable({ rows }: { rows: ShortlistRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-3 py-2">#</th>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Score</th>
            <th className="px-3 py-2">Reason</th>
            <th className="px-3 py-2">CV file</th>
            <th className="px-3 py-2">Approved</th>
            <th className="px-3 py-2">Stage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 align-top">
          {rows.map((r, i) => (
            <tr key={`${r.candidate_email}-${i}`}>
              <td className="px-3 py-3 font-semibold text-gray-400">{i + 1}</td>
              <td className="px-3 py-3 font-medium whitespace-nowrap text-gray-900">
                {r.name || <Dash />}
              </td>
              <td className="px-3 py-3">
                <ScoreBar score={toScore(r.score)} />
              </td>
              <td className="max-w-md px-3 py-3 text-gray-600">
                <RichText text={r.reason} />
              </td>
              <td className="max-w-[12rem] px-3 py-3">
                <CvFile name={r.cv_file} />
              </td>
              <td className="px-3 py-3">
                <YesNoBadge yes={isYes(r.approved)} />
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-gray-700">
                {r.stage || <Dash />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
