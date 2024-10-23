"use client";

import { BookType } from "@/lib/types/types";
import { ReactNode } from "react";
import { ResponsiveContainer } from "recharts";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export const ClientWrapper = ({ data }: { data: BookType[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <DataTable columns={columns} data={data} />
    </ResponsiveContainer>
  );
};
