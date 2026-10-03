import { ActionButton } from "@/components/action-button";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { lqcsDraftQuizQuestionsBySlug, lqcsQuestionBankReviewRows } from "@/src/lib/lqcs-video-courses";

const optionLabels = ["A", "B", "C", "D"];
const firstReviewCourse = lqcsQuestionBankReviewRows[0];
const firstCourseQuestions = firstReviewCourse ? lqcsDraftQuizQuestionsBySlug[firstReviewCourse.slug] ?? [] : [];

export default function QuizAdminPage() {
  const importedCourseCount = lqcsQuestionBankReviewRows.length;
  const approvedCourseCount = lqcsQuestionBankReviewRows.filter((row) => row.approvedCount === 10).length;
  const draftCourseCount = lqcsQuestionBankReviewRows.filter((row) => row.draftCount > 0).length;

  return (
    <>
      <PageHeader
        actions={
          <>
            <ActionButton href="/course-library">Course library</ActionButton>
            <ActionButton href="/reports" variant="secondary">
              Quiz reports
            </ActionButton>
          </>
        }
        description="Admin review area for Batch 1 draft questions. Draft questions are imported for review but are not used by learner quizzes until marked Approved."
        eyebrow="Admin quiz review"
        title="Batch 1 question bank"
      />

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
          <p className="text-xs font-bold uppercase text-slate-500">Imported Batch 1 courses</p>
          <p className="mt-2 text-2xl font-black text-navy">{importedCourseCount}</p>
        </div>
        <div className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
          <p className="text-xs font-bold uppercase text-slate-500">Courses with draft questions</p>
          <p className="mt-2 text-2xl font-black text-care-amber">{draftCourseCount}</p>
        </div>
        <div className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
          <p className="text-xs font-bold uppercase text-slate-500">Approved for learner use</p>
          <p className="mt-2 text-2xl font-black text-care-green">{approvedCourseCount}</p>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">Course question-bank status</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Pass mark is 80% and allowed attempts are 2 for every Batch 1 video course.</p>
          </div>
          <StatusPill status="Draft questions blocked from learner quizzes" />
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-3">Course</th>
                <th className="px-3 py-3">Review status</th>
                <th className="px-3 py-3">Questions</th>
                <th className="px-3 py-3">Draft</th>
                <th className="px-3 py-3">Reviewed</th>
                <th className="px-3 py-3">Approved</th>
                <th className="px-3 py-3">Created by</th>
                <th className="px-3 py-3">Reviewed by</th>
                <th className="px-3 py-3">Approved by</th>
                <th className="px-3 py-3">Version</th>
                <th className="px-3 py-3">Review date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lqcs-line">
              {lqcsQuestionBankReviewRows.map((row) => (
                <tr key={row.slug}>
                  <td className="px-3 py-3 font-semibold text-ink">{row.courseTitle}</td>
                  <td className="px-3 py-3">
                    <StatusPill status={row.status} />
                  </td>
                  <td className="px-3 py-3">{row.questionCount}</td>
                  <td className="px-3 py-3">{row.draftCount}</td>
                  <td className="px-3 py-3">{row.reviewedCount}</td>
                  <td className="px-3 py-3">{row.approvedCount}</td>
                  <td className="px-3 py-3 text-slate-600">{row.createdBy}</td>
                  <td className="px-3 py-3 text-slate-600">{row.reviewedBy}</td>
                  <td className="px-3 py-3 text-slate-600">{row.approvedBy}</td>
                  <td className="px-3 py-3">{row.version}</td>
                  <td className="px-3 py-3">{row.reviewDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
        <h2 className="text-lg font-bold text-ink">Internal answer and explanation preview</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Sample from {firstReviewCourse?.courseTitle}. Learners see explanations only after submission; correct answers are shown here for admin review.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-3">Question</th>
                <th className="px-3 py-3">A</th>
                <th className="px-3 py-3">B</th>
                <th className="px-3 py-3">C</th>
                <th className="px-3 py-3">D</th>
                <th className="px-3 py-3">Correct</th>
                <th className="px-3 py-3">Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lqcs-line">
              {firstCourseQuestions.map((question, index) => (
                <tr key={question.id}>
                  <td className="px-3 py-3 font-semibold text-ink">{question.text}</td>
                  {question.options.slice(0, 4).map((option, optionIndex) => (
                    <td className="px-3 py-3 text-slate-600" key={`${question.id}-${optionIndex}`}>
                      {option}
                    </td>
                  ))}
                  <td className="px-3 py-3 font-black text-lqcs-blue">{optionLabels[question.answerIndex] ?? index + 1}</td>
                  <td className="px-3 py-3 text-slate-600">{question.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
