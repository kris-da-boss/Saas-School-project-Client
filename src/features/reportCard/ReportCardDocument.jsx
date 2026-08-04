import { useState } from "react";
import Button from "../../components/ui/Button";
import { saveReportCardRemarks } from "../../api/result.api";

// One shared component renders the on-screen report card for every role,
// rather than four near-identical copies. What differs per role is passed
// in as props: whether comments can be edited here, and by whom.
export default function ReportCardDocument({
  reportCard,
  studentId,
  canEditTeacherComment = false,
  canEditPrincipalComment = false,
  onRemarksSaved,
}) {
  const [teacherComment, setTeacherComment] = useState(reportCard.teacherComment || "");
  const [principalComment, setPrincipalComment] = useState(reportCard.principalComment || "");
  const [savingRemarks, setSavingRemarks] = useState(false);
  const [remarksError, setRemarksError] = useState("");

  const handleSaveRemarks = async () => {
    setRemarksError("");
    setSavingRemarks(true);
    try {
      const payload = {
        term: reportCard.term,
        session: reportCard.session,
        ...(canEditTeacherComment ? { teacherComment } : {}),
        ...(canEditPrincipalComment ? { principalComment } : {}),
      };
      await saveReportCardRemarks(studentId, payload);
      onRemarksSaved?.();
    } catch (err) {
      setRemarksError(err.response?.data?.message || "Could not save comments");
    } finally {
      setSavingRemarks(false);
    }
  };

  const canEditAnything = canEditTeacherComment || canEditPrincipalComment;
  const hasResults = reportCard.subjects.length > 0;

  return (
    <div className="border border-rule bg-parchment p-4 sm:p-6">
      {/* Header: school branding + student photo, exactly like the PDF */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4">
        <div className="flex items-center gap-3">
          {reportCard.school?.logoUrl ? (
            <img
              src={reportCard.school.logoUrl}
              alt={reportCard.school.name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rule text-xs text-charcoal/50">
              No logo
            </div>
          )}
          <div>
            <p className="font-display text-lg text-ink">{reportCard.school?.name || "School"}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-brass">Student Report Card</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-ink">{reportCard.student.fullName}</p>
            <p className="text-xs text-charcoal/50">
              {reportCard.student.admissionNo} · {reportCard.student.className || "No class"}
            </p>
          </div>
          {reportCard.student.photoUrl ? (
            <img
              src={reportCard.student.photoUrl}
              alt={reportCard.student.fullName}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rule text-sm font-medium text-charcoal/50">
              {reportCard.student.fullName?.[0]}
            </div>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-charcoal/50">
        {reportCard.term} · {reportCard.session}
      </p>

      {/* Subject results table */}
      <div className="mt-4">
        {!hasResults ? (
          <p className="py-6 text-center text-sm text-charcoal/50">
            No results have been recorded for this term yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-rule text-xs uppercase tracking-widest text-charcoal/60">
                  <th className="py-2 pr-2 font-medium">Subject</th>
                  <th className="px-2 py-2 text-center font-medium">CA</th>
                  <th className="px-2 py-2 text-center font-medium">Exam</th>
                  <th className="px-2 py-2 text-center font-medium">Total</th>
                  <th className="px-2 py-2 text-center font-medium">Grade</th>
                  <th className="pl-2 py-2 text-center font-medium">Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {reportCard.subjects.map((s) => (
                  <tr key={s.code}>
                    <td className="py-2 pr-2 text-ink">
                      {s.subject} <span className="text-charcoal/40">({s.code})</span>
                    </td>
                    <td className="px-2 py-2 text-center text-charcoal/70">
                      {s.caScore}/{s.maxCA}
                    </td>
                    <td className="px-2 py-2 text-center text-charcoal/70">
                      {s.examScore}/{s.maxExamScore}
                    </td>
                    <td className="px-2 py-2 text-center font-medium text-ink">
                      {s.total}/{s.maxScore}
                    </td>
                    <td className="px-2 py-2 text-center font-medium text-brass">{s.grade}</td>
                    <td className="pl-2 py-2 text-center text-charcoal/70">{s.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary: total, average, overall grade, position */}
      {hasResults && (
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-rule pt-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-charcoal/50">Total</p>
            <p className="font-medium text-ink">
              {reportCard.totalScore}/{reportCard.totalMax}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-charcoal/50">Average</p>
            <p className="font-medium text-ink">{reportCard.average}%</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-charcoal/50">Overall Grade</p>
            <p className="font-medium text-ink">{reportCard.overallGrade || "—"}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-charcoal/50">Position</p>
            <p className="font-medium text-ink">
              {reportCard.position ? `${reportCard.position} of ${reportCard.classSize}` : "—"}
            </p>
          </div>
        </div>
      )}

      {/* Attendance summary - only present if an admin has set this term's dates */}
      <div className="mt-4 border-t border-rule pt-4">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-brass">Attendance</p>
        {reportCard.attendance ? (
          <p className="text-sm text-charcoal/70">
            Present: {reportCard.attendance.present} · Absent: {reportCard.attendance.absent} · Late:{" "}
            {reportCard.attendance.late} · Excused: {reportCard.attendance.excused} (
            {reportCard.attendance.totalDays} day{reportCard.attendance.totalDays === 1 ? "" : "s"} recorded)
          </p>
        ) : (
          <p className="text-sm text-charcoal/40">
            Not available — this term's start/end dates haven't been set yet.
          </p>
        )}
      </div>

      {/* Comments */}
      <div className="mt-4 grid gap-4 border-t border-rule pt-4 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.2em] text-brass">Teacher's Comment</p>
          {canEditTeacherComment ? (
            <textarea
              value={teacherComment}
              onChange={(e) => setTeacherComment(e.target.value)}
              rows={3}
              className="w-full border-b border-rule bg-transparent py-1.5 text-sm outline-none focus:border-brass"
            />
          ) : (
            <p className="text-sm text-charcoal/70">{reportCard.teacherComment || "—"}</p>
          )}
        </div>
        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.2em] text-brass">Principal's Comment</p>
          {canEditPrincipalComment ? (
            <textarea
              value={principalComment}
              onChange={(e) => setPrincipalComment(e.target.value)}
              rows={3}
              className="w-full border-b border-rule bg-transparent py-1.5 text-sm outline-none focus:border-brass"
            />
          ) : (
            <p className="text-sm text-charcoal/70">{reportCard.principalComment || "—"}</p>
          )}
        </div>
      </div>

      {canEditAnything && (
        <div className="mt-3 flex items-center gap-3">
          <Button size="sm" onClick={handleSaveRemarks} disabled={savingRemarks}>
            {savingRemarks ? "Saving..." : "Save comments"}
          </Button>
          {remarksError && <p className="text-sm text-red-700">{remarksError}</p>}
        </div>
      )}
    </div>
  );
}
