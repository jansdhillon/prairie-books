import { Table } from "@tanstack/react-table";

export function DataTablePagination({ table }: { table: Table<any> }) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        className="px-4 py-2 border"
      >
        Previous
      </button>
      <span>
        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
      </span>
      <button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        className="px-4 py-2 border"
      >
        Next
      </button>
    </div>
  );
}
