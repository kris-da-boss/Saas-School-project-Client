import Button from "../ui/Button";

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4 text-sm text-charcoal/70">
      <Button variant="outline" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>
      <span>
        Page {page} of {pages}
      </span>
      <Button variant="outline" disabled={page >= pages} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    </div>
  );
}
