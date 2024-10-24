"use client";
import { ResponsiveContainer } from "recharts";

import { DataTable } from "@/app/orders/components/data-table";
import { OrderWithItemsType } from "@/lib/schemas/schemas";
import { orderColumns } from "./order-columns";

export const ClientWrapper = ({ data }: { data: OrderWithItemsType[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <DataTable columns={orderColumns} data={data} />
    </ResponsiveContainer>
  );
};
