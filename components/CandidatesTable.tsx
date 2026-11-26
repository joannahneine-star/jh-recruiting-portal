"use client";

import { useMemo, useState } from "react";
import type { Candidate } from "@/lib/data";
import { CvFile, Dash } from "@/components/ui";

export default function CandidatesTable({ candidates }: { candidates: Candidate[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter((c) =>
      [c.name, c.skills, c.languages].some((field) => field.toLowerCase().includes(q)),
    );
  }, [candidates, query]);

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          <span className="text-lg font-bold text-gray-900">{candidates.length}</span>{" "}
          candidates in total
          {query && (
            <span className="text-gray-500">
              {" "}
              · showing {filtered.length}
            </span>
          )}
        </p>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, skills or languages…"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-80"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Languages</th>
              <th className="px-4 py-3">Skills</th>
              <th className="px-4 py-3">Total years</th>
              <th className="px-4 py-3">US hours</th>
              <th className="px-4 py-3">CV file</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 align-top">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  {candidates.length === 0
                    ? "No candidates yet."
                    : "No candidates match your search."}
                </td>
              </tr>
            )}
            {filtered.map((c, i) => (
              <tr key={`${c.email}-${i}`} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium whitespace-nowrap text-gray-900">
                  {c.name || <Dash />}
                </td>
                <td className="px-4 py-3 text-gray-700">{c.role || <Dash />}</td>
                <td className="px-4 py-3 text-gray-700">{c.location || <Dash />}</td>
                <td className="px-4 py-3 text-gray-700">{c.languages || <Dash />}</td>
                <td className="max-w-xs px-4 py-3 text-gray-600">{c.skills || <Dash />}</td>
                <td className="px-4 py-3 text-gray-700 tabular-nums">{c.years_total || <Dash />}</td>
                <td className="px-4 py-3 text-gray-700">{c.us_hours || <Dash />}</td>
                <td className="max-w-[12rem] px-4 py-3">
                  <CvFile name={c.cv_file} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
