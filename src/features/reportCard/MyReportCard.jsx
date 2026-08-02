import { useState } from "react";
import { getMyReportCard, downloadMyReportCardPdf } from "../../api/result.api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const TERMS = ["First Term", "Second Term", "Third Term"];

export default function MyReportCard() {
  const [term, setTerm] = useState(TERMS[0]);
  const [session, setSession] = useState("");
  const [reportCard, setReportCard] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleView = async (e) => {
    e.preventDefault();
    setError("");
    setReportCard(null);
    setLoading(true);
    try {
      const { data } = await getMyReportCard(term, session);
      setReportCard(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load your report card");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await downloadMyReportCardPdf(term, session);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `report-card_${term}_${session}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleView} className="flex flex-wrap items-end gap-4">
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
        <div className="border border-rule p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
            <p className="text-xs text-charcoal/50">
              {reportCard.term} · {reportCard.session}
            </p>
            <Button size="sm" variant="ghost" onClick={handleDownload} disabled={downloading}>
              {downloading ? "Preparing..." : "Download PDF"}
            </Button>
          </div>

          {reportCard.subjects.length === 0 ? (
            <p className="text-sm text-charcoal/50">No results recorded for this term yet.</p>
          ) : (
            <div className="divide-y divide-rule">
              {reportCard.subjects.map((s) => (
                <div key={s.code} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-ink">
                    {s.subject} <span className="text-charcoal/40">({s.code})</span>
                  </span>
                  <span className="text-charcoal/60">
                    {s.score}/{s.maxScore} · Grade {s.grade}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-6 border-t border-rule pt-4 text-sm">
            <p className="font-medium text-ink">Average: {reportCard.average}%</p>
            {reportCard.position && (
              <p className="font-medium text-ink">
                Position: {reportCard.position} of {reportCard.classSize}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
