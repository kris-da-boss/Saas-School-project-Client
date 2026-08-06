import MyAssignments from "../../features/assignments/MyAssignments";

export default function MyAssignmentsPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 border-b border-rule pb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-brass">Student</p>
        <h1 className="font-display text-2xl text-ink">My Assignments</h1>
      </div>
      <MyAssignments />
    </div>
  );
}
