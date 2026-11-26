import { getTests, isYes } from "@/lib/data";
import { Dash, PageHeader, SheetError } from "@/components/ui";

export const revalidate = 60;

export default async function BotTestPage() {
  const tests = await getTests();

  if (!tests.ok) {
    return (
      <>
        <PageHeader title="Bot Test" />
        <SheetError name="Bot tests" />
      </>
    );
  }

  const passed = tests.rows.filter((t) => isYes(t.pass)).length;

  return (
    <>
      <div className="mb-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-6 text-center sm:p-10">
        <p className="text-4xl font-bold text-indigo-700 sm:text-5xl">
          Bot score: {passed} / 10
        </p>
        <p className="mt-3 text-gray-600">
          The correct answers were written before the bot was tested.
        </p>
      </div>

      {tests.rows.length === 0 ? (
        <p className="rounded-2xl bg-gray-50 p-6 text-gray-500">No test questions yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Correct answer</th>
                <th className="px-4 py-3">Bot answer</th>
                <th className="px-4 py-3">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 align-top">
              {tests.rows.map((t, i) => {
                const pass = isYes(t.pass);
                return (
                  <tr key={`${t.n}-${i}`}>
                    <td className="px-4 py-3 font-semibold text-gray-400">{t.n || i + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{t.question || <Dash />}</td>
                    <td className="px-4 py-3 text-gray-700">{t.correct_answer || <Dash />}</td>
                    <td className="px-4 py-3 text-gray-700">{t.bot_answer || <Dash />}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {pass ? (
                        <span className="font-medium text-green-700">✅ Pass</span>
                      ) : (
                        <span className="font-medium text-red-700">❌ Fail</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
