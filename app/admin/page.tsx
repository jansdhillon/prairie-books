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
import { addBookAction } from "../actions";

export default async function HomePage() {

  return (
    <AdminDashboard addBookAction={addBookAction}/>
  );
}
