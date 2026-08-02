import { useState, useEffect } from "react";
import { getMyChildren } from "../../api/parentChild.api";
import { getReportCard } from "../../api/result.api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

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
        <div className="border border-rule p-6">
          <div className="mb-4 border-b border-rule pb-4">
            <p className="font-display text-lg text-ink">{reportCard.student.fullName}</p>
            <p className="text-xs text-charcoal/50">
              {reportCard.student.admissionNo} · {reportCard.term} · {reportCard.session}
            </p>
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
