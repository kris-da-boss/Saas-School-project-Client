import MyChildrenReportCards from "../../features/reportCard/MyChildrenReportCards";

export default function ParentReportCardPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 border-b border-rule pb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-brass">Parent</p>
        <h1 className="font-display text-2xl text-ink">Report Cards</h1>
      </div>
      <MyChildrenReportCards />
    </div>
  );
}
