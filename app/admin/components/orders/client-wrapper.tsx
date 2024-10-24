"use client";

import { BookType } from "@/lib/types/types";
import { ReactNode } from "react";
import { ResponsiveContainer } from "recharts";
import { orderColumns } from "@/app/orders/components/order-columns";
import { DataTable } from "@/app/orders/components/data-table";
import { OrderWithItemsType } from "@/lib/schemas/schemas";

export const ClientWrapper = ({ data }: { data: OrderWithItemsType[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <DataTable columns={orderColumns} data={data} />
    </ResponsiveContainer>
  );
};
