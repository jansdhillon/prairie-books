import { DataTable } from "@/app/admin/components/data-table";
import { ResponsiveContainer } from "recharts";
import { getAllBooks } from "../../actions/get-all-books";
import { columns } from "../components/columns";
import { ClientWrapper } from "../components/client-wrapper";

export default async function HomePage() {
  const allBooks = await getAllBooks();

  return <ClientWrapper data={allBooks} />;
}
