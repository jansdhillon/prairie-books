"use client";;
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  globalFilter?: string;
  setGlobalFilter: (value: string) => void;
  genreOptions: { label: string; value: string }[];
}


export function DataTableToolbar<TData>({
  table,
  globalFilter,
  setGlobalFilter,
  genreOptions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;





  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-1 items-center space-x-2">
      <Input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search books..."
          className="w-full max-w-sm"
        />

        <DataTableFacetedFilter
          column={table.getColumn("genre")}
          title="Genre"
          options={genreOptions}
        />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        {/* <Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                >
                  <SortDescIcon className="w-4 h-4  " />
                  <span className="sr-only">Sort Results</span>
                </Button>
              </TooltipTrigger>
            </DropdownMenuTrigger>
            <TooltipContent>Sort Requests</TooltipContent>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSort({ sort: "newest" })}>
                Newest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort({ sort: "oldest" })}>
                Oldest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort({ sort: "due" })}>
                Due
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Tooltip> */}
      </div>


    </div>
  );
}
