"use client";

import { BookType } from "@/lib/types/types";
import { ResponsiveContainer } from "recharts";

import { bookColumns } from "./book-columns";
import { DataTable } from "../data-table";

export const ClientWrapper = ({ data }: { data: BookType[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <DataTable columns={bookColumns} data={data} />
    </ResponsiveContainer>
  );
};
