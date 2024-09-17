import AdminDashboard from "@/components/admin-dashboard";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addBookAction } from "@/app/actions/add-book";

export default async function HomePage() {

  return (
    <AdminDashboard addBookAction={addBookAction}/>
  );
}
