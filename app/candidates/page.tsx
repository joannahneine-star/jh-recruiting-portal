import { getCandidates } from "@/lib/data";
import { PageHeader, SheetError } from "@/components/ui";
import CandidatesTable from "@/components/CandidatesTable";

export const revalidate = 60;

export default async function CandidatesPage() {
  const candidates = await getCandidates();

  return (
    <>
      <PageHeader title="Candidates" subtitle="Everyone in the candidate database." />
      {candidates.ok ? (
        <CandidatesTable candidates={candidates.rows} />
      ) : (
        <SheetError name="Candidates" />
      )}
    </>
  );
}
