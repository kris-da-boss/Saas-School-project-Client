import { useState, useEffect } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { getTerm, upsertTerm } from "../../api/term.api";

const TERMS = ["First Term", "Second Term", "Third Term"];

export default function TermDatesForm() {
  const [term, setTerm] = useState(TERMS[0]);
  const [session, setSession] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Whenever term/session change (and both are filled), check if dates are
  // already set, so an admin revisiting this doesn't lose what they entered
  // before.
  useEffect(() => {
    if (!term || !session) return;
    (async () => {
      try {
        const { data } = await getTerm(term, session);
        if (data.data) {
          setStartDate(data.data.startDate?.slice(0, 10) || "");
          setEndDate(data.data.endDate?.slice(0, 10) || "");
        } else {
          setStartDate("");
          setEndDate("");
        }
      } catch {
        // No dates set yet for this term - leave the fields blank
      }
    })();
  }, [term, session]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      await upsertTerm({ term, session, startDate, endDate });
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save term dates");
    } finally {
      setSaving(false);
    }
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="mb-6 text-xs uppercase tracking-[0.2em] text-brass underline"
      >
        Set term dates (for attendance summaries)
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSave}
      className="mb-6 flex flex-wrap items-end gap-4 border border-rule p-4"
    >
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
      <Input
        label="Start date"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      />
      <Input
        label="End date"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        required
      />
      <Button type="submit" size="sm" disabled={saving}>
        {saving ? "Saving..." : "Save dates"}
      </Button>
      {saved && <p className="text-sm text-forest">Saved.</p>}
      {error && <p className="text-sm text-red-700">{error}</p>}
    </form>
  );
}
