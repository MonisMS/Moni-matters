import { useEffect, useState } from "react";
import { listExpenses,deletedExpense } from "@/lib/api";
import type { Expense } from "@/types/expenses";
import { Button } from "./button";
type Props = { refreshKey?: number };

function normalizeExpense(e:any): Expense {
 
  if (e?.amount && typeof e.amount === "object") {
    return e as Expense;
  }
  if (typeof e?.amount === "number" && e?.currency) {
    return { ...e, amount: { amount: e.amount, currency: e.currency } } as Expense;
  }
  // If amount is missing (your 3rd item), provide a safe default
  return { ...e, amount: { amount: 0, currency: "INR" } } as Expense;
}

export default function ExpenseList({ refreshKey = 0 }: Props) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const data = await listExpenses();
        const normalized = data.expenses.map(normalizeExpense)
        if (!cancelled) setExpenses(normalized);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; }
  }, [refreshKey]);
const handleDelete = async (id:string) =>{
    if(!confirm("Delete this expense?")) return;
    setError(null);
    setDeletingId(id);
    const prev = expenses;
    setExpenses((exps) => exps.filter((e) => e._id !== id));
    try {
      await deletedExpense(id);
    } catch (e) {
      setExpenses(prev);
      setError(e instanceof Error ? e.message : "Unknown error");
    }
    finally{
      setDeletingId(null);
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-sm text-red-600">Error: {error}</p>;

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Total: {expenses.length}</p>
      <ul className="space-y-1">
        {expenses.map((e) => (
          <li key={e._id} className="flex items-center justify-between border rounded-md px-3 py-2">
            <span className="text-sm">{e.description || "No description"} — {e.category || "General"}</span>
            <span className="font-medium">{e.amount.amount} {e.amount.currency}</span>
            <Button
            variant={"destructive"}
            size={"sm"}
            onClick={() => handleDelete(e._id)}
            disabled={deletingId === e._id}
            >
              {deletingId === e._id ? "Deleting..." : "Delete"}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}