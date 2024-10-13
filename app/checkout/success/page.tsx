"use client";
import { createClient } from "@/utils/supabase/server";
import { getOrderById } from "@/app/actions/get-order-by-id";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


interface SessionType {
  id: string;
  amount_total: number;
  currency: string;
  payment_status: string;
}

export default function SuccessPage({ searchParams }: { searchParams: { order_id: string, session_id: string } }) {
  const orderId = searchParams.order_id;
  const sessionId = searchParams.session_id!;

  const [session, setSession] = useState<SessionType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {

    if (sessionId) {
      fetch(`/api/retrieve-session?session_id=${sessionId}`)
        .then((response) => response.json())
        .then((data) => {
          setSession(data.session);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching session:", error);
          setLoading(false);
        });
    } else {
      router.push("/");
    }
  }, [router]);


  if (loading) return <div>Loading...</div>;

  if (!session) return <div>Payment not found</div>;

  return (
    <div>
      <h1>Thank you for your order!</h1>
      <p>Order ID: {session.id}</p>
      <p>Total Amount: ${(session.amount_total / 100).toFixed(2)} {session.currency.toUpperCase()}</p>
      <p>Status: {session.payment_status}</p>
    </div>
  );
}
