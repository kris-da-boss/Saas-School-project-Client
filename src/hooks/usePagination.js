import { useState } from "react";

export function usePagination(initialLimit = 20) {
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const pages = Math.max(Math.ceil(total / limit), 1);

  return { page, setPage, limit, total, setTotal, pages };
}
