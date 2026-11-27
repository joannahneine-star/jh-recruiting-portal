# AI Recruiting Copilot (Project 3)

**n8n + GoHighLevel + Slack + Claude Code**, by Joanna Hneine

A recruiting copilot for a remote-staffing agency. It turns client call notes into job descriptions, reads every CV, finds the best 5 candidates with reasons, and runs outreach in GoHighLevel. **A recruiter approves every step.**

- **Live portal:** https://jh-recruiting-portal.vercel.app
- **Portal code:** https://github.com/joannahneine-star/jh-recruiting-portal
- **Slack:** workspace "Joanna", channel `#recruiting-copilot`, bot `@recruiting`
- **Loom:** _(add link)_

---

## How it works (the full flow)

```
Client call transcript ─▶ [WF1] AI writes job description ─▶ Slack: ✅ Approve
                                                                │
CVs (PDF / Word) ─▶ [WF2] AI reads every CV ─▶ Google Sheet      ▼
                                                [WF4] Top 5 for that job ─▶ Slack: recruiter picks
Recruiter asks in Slack ─▶ [WF3] Top 5 + score + reason              │
                                                                     ▼
                                  GoHighLevel: contact + pipeline "Approved" + email sequence
                                  (stops when the candidate replies → stage "Replied")
```

| Workflow | Starts when… | What it does |
|---|---|---|
| **1. Transcript → Job Description** | a transcript lands in Drive `/Transcripts` | AI writes the job description using only facts from the call → saved as "Waiting for approval" → Slack **Approve / Reject** → status updated. If approved, starts Workflow 4. |
| **2. CV Reader** | a CV lands in Drive `/CVs` | Reads PDF and Word → unreadable CVs are **flagged** (Sheet + Slack) → AI extracts skills, years, languages, US hours → **one row per person** (matched by email). A newer CV replaces an older one. |
| **3. Ask the Bot** | someone writes `@recruiting …` in Slack | Reads all candidates → AI returns the **top 5**, each with a **score**, a **2-line reason** and the **CV file**. No match → says so. |
| **4. Shortlist & Outreach** | a job description is approved (called by WF1) | Top 5 for that job → Slack form: recruiter picks who to contact → shortlist saved → only picked candidates go to GHL (contact, opportunity, tag) → GHL email sequence. |

---

## The rules from the brief, and how each one is met

| Rule | How |
|---|---|
| Nothing reaches a candidate or client until a recruiter clicks Approve | Two approval gates in Slack: (1) the job description, (2) the candidates to contact. Only picked candidates are sent to GHL. |
| No good match? The bot says so. It never invents a candidate | The prompt forbids it, **and** a code step removes any name that isn't in the database. Tested: "Japanese + Salesforce" → "No good match". |
| Every recommendation names the CV it came from | Every answer shows `📄 CV: <file>`. The file name is taken from the database, not from the AI. |
| Unreadable CVs are flagged, never silently skipped | A CV with under 100 characters of text goes to the **Flags** tab, plus a Slack alert. Tested with the scanned CV. |
| An updated CV replaces the old one | One row per email. A CV is only saved if it is new or its `cv_date` is the same or newer. |

---

## Data (made with AI, messy on purpose)

- **5 call transcripts** (GHL specialist, executive assistant, support rep, social media manager, bookkeeper). They include mind-changes, e.g. "1,800–2,400… make that up to 2,500".
- **60 CVs** (PDF + Word) for **55 people**:
  - 1 scanned, image-only CV → flagged
  - 3 people who appear twice → 1 row each
  - 2 people with an updated CV (2024 → 2026) → the newer one wins
- **Result:** 54 candidates in the Sheet + 1 flag. Checked against the master list: 53 of 54 perfect on the first pass (1 field corrected).

---

## My choices ("your call" in the brief)

- **Job description format:** Job Title · Client · About the role · Responsibilities · Must have · Nice to have · Hours / time zone · Pay · Start date. Missing info = "Not specified".
- **Pipeline stages (GHL "JH - Candidate Pipeline"):** New Match → Approved → Outreach Sent → Replied → Interview → Sent to Client → Hired → Rejected.
- **Scoring (0–100):** meets all must-haves = 60 · how far above the minimum = 25 · total experience = 15. Only "Must have" items filter; "Nice to have" items add points. Must-haves a CV can't show (e.g. "passes a skills test") are left to the interview.
- **Database:** Google Sheets: `Candidates`, `Roles`, `Shortlists`, `Flags`, `Tests`. Simple for a recruiter to open and check.
- **Search:** no vector database. With 54 candidates, all of them fit in one AI request, so the bot compares everyone at once.
- **AI models:** Gemini (job descriptions). Groq `openai/gpt-oss-120b` (CV reading and search), chosen because the free Gemini tier allowed only 20 requests per day.
- **Portal design:** Next.js on Vercel, built with Claude Code. Reads the Sheet's published CSV links (read-only, no keys).

---

## Portal

1. **Open Roles:** each role with its job description and shortlist (score, reason, CV, approved, stage)
2. **Pipeline:** candidates per stage
3. **Candidates:** all 54, searchable
4. **Bot Test:** 10 questions, the right answers, and the bot's score

### Bot test result: **10 / 10**
The right answers were written **before** testing, from the master data. Four questions only pass if updated CVs replaced old ones, and one question checks that the bot says "no match".

---

## GoHighLevel setup

- **JH - Add Approved Candidate:** Inbound Webhook → Create Contact → Create/Update Opportunity (stage *Approved*) → tag `jh-outreach`
- **JH - Candidate Outreach:** tag added → Email 1 → stage *Outreach Sent* → wait 2 days → Email 2 → wait 3 days → Email 3. **Stop on response: ON**
- **JH - Candidate Replied:** customer replied (email, tag `jh-outreach`) → stage *Replied*

Tested end to end: picked candidates received Email 1, a reply moved the candidate to *Replied*, and the sequence stopped.

---

## Security

- No API keys or passwords in the code, the README or the portal. Keys live only in n8n credentials.
- GHL is reached through an inbound webhook, so no GHL API key is used.
- The portal reads public, read-only CSV links of a Sheet that contains only fake data.

---

## Honest limits and next upgrades

- **5-minute run limit** on the course n8n server: the first import of 60 CVs was done in groups of about 20. New CVs arriving one by one are fine. *Upgrade:* send each CV to its own sub-workflow run.
- **Free AI limits:** Groq allows about one search per minute on the free plan; Retry On Fail handles short bursts. *Upgrade:* paid tier.
- **Demo emails:** candidate emails are fake, so the demo sends outreach to Gmail aliases (`joannahneine+name@gmail.com`).
- **Stages after "Replied"** (Interview, Hired…) are moved by the recruiter in GHL. *Upgrade:* a GHL → n8n webhook to sync every stage change back to the Sheet.
- **Call recordings:** today the input is a text transcript. *Upgrade:* speech-to-text (e.g. Whisper) so the agency can drop in the audio file.

---

## Files

- `/n8n-workflows/`: the 4 exported workflows (JSON)
- Portal code: this repository

---

## Portal: technical notes

- **Data:** 4 tabs of the Google Sheet (Roles, Shortlists, Candidates, Tests), published to the web as CSV. The links live in one file: [`config.ts`](./config.ts). The site re-reads them at most every 60 seconds.
- Empty cells are shown as "—". If a sheet can't be loaded, the page shows a friendly message instead of breaking.
- **Tech:** Next.js (App Router) · Tailwind CSS · papaparse

### Run it locally
You need Node.js 20 or newer.
```bash
npm install
npm run dev
```
Then open http://localhost:3000.

### Deploy on Vercel
Import the GitHub repository on vercel.com → keep the default settings (Next.js) → **Deploy**. No environment variables are needed.
