import { useState } from "react";
import { getStudents } from "../../api/student.api";
import { getReportCard, downloadReportCardPdf } from "../../api/result.api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import ReportCardDocument from "./ReportCardDocument";
import { useAuth } from "../../hooks/useAuth";

const TERMS = ["First Term", "Second Term", "Third Term"];

export default function ReportCardViewer() {
  const { user } = useAuth();
  const [admissionNo, setAdmissionNo] = useState("");
  const [term, setTerm] = useState(TERMS[0]);
  const [session, setSession] = useState("");
  const [reportCard, setReportCard] = useState(null);
  const [resolvedStudentId, setResolvedStudentId] = useState(null); // cached from the search that produced the currently-displayed report card
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setReportCard(null);
    setResolvedStudentId(null);
    setLoading(true);
    try {
      // Look the student up by admission number first - the report card
      // endpoint needs their internal id, which nobody memorizes.
      const { data: studentsData } = await getStudents({ search: admissionNo, limit: 5 });
      const match = studentsData.data.find((s) => s.admissionNo === admissionNo.trim());
      if (!match) {
        setError("No student found with that admission number");
        return;
      }

      const { data } = await getReportCard(match._id, term, session);
      setReportCard(data.data);
      setResolvedStudentId(match._id);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load report card");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    // Uses the id cached from the search that produced what's on screen -
    // NOT a fresh lookup of the admissionNo field, which could have been
    // edited since then and silently download the wrong student's PDF.
    if (!resolvedStudentId) return;
    setDownloading(true);
    try {
      const response = await downloadReportCardPdf(resolvedStudentId, term, session);

      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${reportCard.student.fullName.replace(/\s+/g, "_")}_${term}_${session}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  const refetchAfterRemarks = async () => {
    if (!resolvedStudentId) return;
    const { data } = await getReportCard(resolvedStudentId, term, session);
    setReportCard(data.data);
  };

  const hasResults = reportCard?.subjects?.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-4">
        <Input
          label="Admission number"
          value={admissionNo}
          onChange={(e) => setAdmissionNo(e.target.value)}
          required
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-widest text-charcoal/70">Term</label>
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="border-b border-rule bg-transparent py-2 text-charcoal outline-none focus:border-brass"
          >
            {TERMS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Session"
          value={session}
          onChange={(e) => setSession(e.target.value)}
          placeholder="e.g. 2025/2026"
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Searching..." : "View report card"}
        </Button>
      </form>

      {error && <p className="text-sm text-red-700">{error}</p>}

      {reportCard && (
        <div className="flex flex-col gap-4">
          {/* Only ever show the download button when there's something real
              to download - matches the backend's own refusal to generate an
              empty PDF, rather than letting the click happen and fail. */}
          {hasResults && (
            <div className="flex justify-end">
              <Button size="sm" variant="ghost" onClick={handleDownload} disabled={downloading}>
                {downloading ? "Preparing..." : "Download PDF"}
              </Button>
            </div>
          )}

          <ReportCardDocument
            reportCard={reportCard}
            studentId={resolvedStudentId}
            canEditTeacherComment={user?.role === "admin" || user?.role === "teacher"}
            canEditPrincipalComment={user?.role === "admin"}
            onRemarksSaved={refetchAfterRemarks}
          />
        </div>
      )}
    </div>
  );
}
