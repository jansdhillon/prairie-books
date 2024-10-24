import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getOrdersWithOrderItems } from "@/utils/supabase/queries";
import { getUserDataAction } from "../actions/get-user";
import { DataTable } from "@/app/orders/components/data-table";
import { orderColumns } from "@/app/orders/components/order-columns";

export default async function OrdersPage() {

  const supabase = createClient();

  const { data: userData, error: authError } = await getUserDataAction();
  if (authError) {
    redirect("/sign-in");
  }

  const { data: orders, error } = await getOrdersWithOrderItems(
    supabase,
    userData.id
  );

  if (error) {
    console.error("Error fetching orders:", error.message);
  }

  return (
    <div className="flex flex-1 flex-col space-y-6">
      <h1 className="text-2xl font-bold text-left">Your Orders</h1>
      <Separator />
      <p className="text-lg text-muted-foreground">
        View and track your book orders.
      </p>
      {orders && orders?.length > 0 ? (
        <DataTable columns={orderColumns} data={orders} />
      ) : (
        <p className="text-center text-muted-foreground">
          You haven't placed any orders yet.
        </p>
      )}
    </div>
  );
}
