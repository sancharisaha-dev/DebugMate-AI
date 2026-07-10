export type PaginationResult = {
  page: number;
  limit: number;
  skip: number;
};

export function getPagination(
  page?: number,
  limit?: number
): PaginationResult {
  const currentPage =
    page && !Number.isNaN(page) && page > 0
      ? page
      : 1;

  const currentLimit =
    limit && !Number.isNaN(limit)
      ? Math.min(limit, 100)
      : 10;

  return {
    page: currentPage,
    limit: currentLimit,
    skip: (currentPage - 1) * currentLimit
  };
}