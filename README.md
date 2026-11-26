# Recruiting Copilot Portal

A small, read-only website for recruiters that shows what the **AI Recruiting Copilot**
(n8n + GoHighLevel + Slack + Claude Code) is doing, in plain language.

## What the portal shows

| Page | What you see |
|------|--------------|
| **Open Roles** (home) | One card per role: client, title, status badge (green = Approved, yellow = Waiting for approval, red = Rejected) and approval date. Open **Job description** to read the full brief. Below it is the role's shortlist, ranked by score (best first), with the reason, CV file, approval and current stage. |
| **Pipeline** | A board showing where each *approved* candidate is: Approved → Outreach Sent → Replied → Interview → Sent to Client → Hired / Rejected. Small boxes at the top count each stage, plus how many shortlisted candidates were not selected. |
| **Candidates** | Every candidate in the database. Type in the search box to filter by name, skills or languages. |
| **Bot Test** | The bot's score out of 10 on a fixed set of test questions, with the correct answer, the bot's answer and Pass / Fail for each. |

## Where the data comes from

All data is read live from **4 tabs of one Google Sheet**, published to the web as CSV
(no API keys, no login):

- **Roles** – `role_id, client, title, job_description, status, approved_at`
- **Shortlists** – `role_id, candidate_email, name, score, reason, cv_file, approved, stage, ghl_email`
- **Candidates** – `email, name, role, location, languages, skills, years_total, us_hours, summary, cv_file, cv_date`
- **Bot tests** – `n, question, correct_answer, bot_answer, pass`

The links live in one file: [`config.ts`](./config.ts). The site re-reads the sheets
at most every **60 seconds**, so edits in Google Sheets show up within about a minute.
Empty cells are shown as "—", and if a sheet can't be loaded the page shows a friendly
message instead of breaking.

## Run it on your computer

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. On [vercel.com](https://vercel.com), click **Add New → Project** and import the repository.
3. Keep the default settings (Framework: Next.js) and click **Deploy**.

No environment variables are needed.

## Tech

Next.js (App Router) · Tailwind CSS · papaparse
