import Papa from "papaparse";
import {
  ROLES_CSV,
  SHORTLISTS_CSV,
  CANDIDATES_CSV,
  TESTS_CSV,
} from "@/config";

export type Role = {
  role_id: string;
  client: string;
  title: string;
  job_description: string;
  status: string;
  approved_at: string;
};

export type ShortlistRow = {
  role_id: string;
  candidate_email: string;
  name: string;
  score: string;
  reason: string;
  cv_file: string;
  approved: string;
  stage: string;
  ghl_email: string;
};

export type Candidate = {
  email: string;
  name: string;
  role: string;
  location: string;
  languages: string;
  skills: string;
  years_total: string;
  us_hours: string;
  summary: string;
  cv_file: string;
  cv_date: string;
};

export type TestRow = {
  n: string;
  question: string;
  correct_answer: string;
  bot_answer: string;
  pass: string;
};

export type SheetResult<T> = { ok: true; rows: T[] } | { ok: false; rows: [] };

/**
 * Downloads a public CSV and turns it into a list of rows.
 * Every expected column is always present as a string (empty cells become ""),
 * so the pages never crash on blank cells.
 */
async function loadSheet<T extends Record<string, string>>(
  url: string,
  columns: (keyof T)[],
): Promise<SheetResult<T>> {
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const parsed = Papa.parse<Record<string, unknown>>(text, {
      header: true,
      skipEmptyLines: "greedy",
      transformHeader: (h) => h.trim(),
    });
    const rows = parsed.data
      .map((raw) => {
        const row = {} as T;
        for (const col of columns) {
          const v = raw?.[col as string];
          (row as Record<string, string>)[col as string] =
            v == null ? "" : String(v).trim();
        }
        return row;
      })
      // drop rows that are completely empty
      .filter((row) => Object.values(row).some((v) => v !== ""));
    return { ok: true, rows };
  } catch (err) {
    console.error(`Could not load sheet ${url}:`, err);
    return { ok: false, rows: [] };
  }
}

export const getRoles = () =>
  loadSheet<Role>(ROLES_CSV, [
    "role_id",
    "client",
    "title",
    "job_description",
    "status",
    "approved_at",
  ]);

export const getShortlists = () =>
  loadSheet<ShortlistRow>(SHORTLISTS_CSV, [
    "role_id",
    "candidate_email",
    "name",
    "score",
    "reason",
    "cv_file",
    "approved",
    "stage",
    "ghl_email",
  ]);

export const getCandidates = () =>
  loadSheet<Candidate>(CANDIDATES_CSV, [
    "email",
    "name",
    "role",
    "location",
    "languages",
    "skills",
    "years_total",
    "us_hours",
    "summary",
    "cv_file",
    "cv_date",
  ]);

export const getTests = () =>
  loadSheet<TestRow>(TESTS_CSV, [
    "n",
    "question",
    "correct_answer",
    "bot_answer",
    "pass",
  ]);

/** Turns "90", " 90 ", "90/100" into a number from 0 to 100 (or null if blank). */
export function toScore(value: string): number | null {
  const n = parseFloat(value);
  if (Number.isNaN(n)) return null;
  return Math.max(0, Math.min(100, n));
}

/** True for "yes", "Yes", "TRUE", "y", "1", "✅". */
export function isYes(value: string): boolean {
  return ["yes", "y", "true", "1", "✅"].includes(value.trim().toLowerCase());
}
