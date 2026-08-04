import { useState, useEffect } from "react";
import { getMyChildren } from "../../api/parentChild.api";
import { getReportCard, downloadReportCardPdf } from "../../api/result.api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import ReportCardDocument from "./ReportCardDocument";

const TERMS = ["First Term", "Second Term", "Third Term"];

export default function MyChildrenReportCards() {
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [term, setTerm] = useState(TERMS[0]);
  const [session, setSession] = useState("");
  const [reportCard, setReportCard] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoadingChildren(true);
      try {
        const { data } = await getMyChildren();
        setChildren(data.data);
        if (data.data.length === 1) setSelectedChildId(data.data[0]._id);
      } finally {
        setLoadingChildren(false);
      }
    })();
  }, []);

  const handleView = async (e) => {
    e.preventDefault();
    setError("");
    setReportCard(null);
    setLoading(true);
    try {
      // The report card endpoint itself only allows a parent to view a
      // child that's actually linked to them (assertReportCardAccess on the
      // backend) - the dropdown here is a UX convenience, not the security
      // boundary.
      const { data } = await getReportCard(selectedChildId, term, session);
      setReportCard(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load report card");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await downloadReportCardPdf(selectedChildId, term, session);
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

  const hasResults = reportCard?.subjects?.length > 0;

  if (loadingChildren) return <p className="text-sm text-charcoal/60">Loading...</p>;
  if (children.length === 0) {
    return <p className="text-sm text-charcoal/50">No children are linked to your account yet.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleView} className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-widest text-charcoal/70">Child</label>
          <select
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            required
            className="border-b border-rule bg-transparent py-2 text-charcoal outline-none focus:border-brass"
          >
            <option value="">Select a child</option>
            {children.map((child) => (
              <option key={child._id} value={child._id}>
                {child.fullName}
              </option>
            ))}
          </select>
        </div>
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
          {loading ? "Loading..." : "View report card"}
        </Button>
      </form>

      {error && <p className="text-sm text-red-700">{error}</p>}

      {reportCard && (
        <div className="flex flex-col gap-4">
          {hasResults && (
            <div className="flex justify-end">
              <Button size="sm" variant="ghost" onClick={handleDownload} disabled={downloading}>
                {downloading ? "Preparing..." : "Download PDF"}
              </Button>
            </div>
          )}

          <ReportCardDocument reportCard={reportCard} />
        </div>
      )}
    </div>
  );
}
