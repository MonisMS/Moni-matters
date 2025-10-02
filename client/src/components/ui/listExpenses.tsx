import { useEffect, useState } from "react";
import { listExpenses,deletedExpense, updateExpense } from "@/lib/api";
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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

const [draft, setDraft] = useState({
    amount: "",      // string in inputs
    currency: "",
    description: "",
    category: "",
    date: "",        // yyyy-mm-dd
  });
 function toYyyyMmDd(iso: string) {
    const d = new Date(iso);
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

   function toISODateUTC(yyyyMmDd: string) {
    const [y, m, d] = yyyyMmDd.split("-").map(Number);
    return new Date(Date.UTC(y!, (m! - 1), d!)).toISOString();
  }

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
const startEdit = (row: Expense) => {
    setEditingId(row._id);
    setError(null);
    setDraft({
      amount: String(row.amount.amount ?? 0),
      currency: row.amount.currency ?? "INR",
      description: row.description ?? "",
      category: row.category ?? "General",
      date: toYyyyMmDd(row.date),
    });
  };

 const cancelEdit = () => {
    setEditingId(null);
    setDraft({ amount: "", currency: "", description: "", category: "", date: "" });
  };
    const saveEdit = async (id: string) => {
    const amountNum = Number(draft.amount);
    if (Number.isNaN(amountNum) || amountNum <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    if (!draft.currency.trim()) {
      setError("Currency is required.");
      return;
    }
    if (!draft.category.trim()) {
      setError("Category is required.");
      return;
    }
    if (!draft.date) {
      setError("Date is required.");
      return;
    }
     const payload = {
      // Backend expects amount and currency separately; it will nest them
      amount: amountNum,
      currency: draft.currency.trim().toUpperCase(),
      description: draft.description.trim(),
      category: draft.category.trim(),
      date: toISODateUTC(draft.date),
    };

    setSavingId(id);
    setError(null);
     try {
      const res = await updateExpense(id, payload);
      const updated = normalizeExpense(res.updatedExpense);
      setExpenses((xs) => xs.map((x) => (x._id === id ? updated : x)));
      setEditingId(null);
      setDraft({ amount: "", currency: "", description: "", category: "", date: "" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-sm text-red-600">Error: {error}</p>;
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Total: {expenses.length}</p>
      <ul className="space-y-1">
        {expenses.map((e) => {
          const isEditing = editingId === e._id;
          return (
            <li key={e._id} className="flex items-center justify-between gap-3 border rounded-md px-3 py-2">
              <div className="flex-1">
                {isEditing ? (
                  <div className="grid gap-2">
                    <input
                      className="h-9 w-full rounded-md border px-3"
                      value={draft.description}
                      onChange={(ev) => setDraft((d) => ({ ...d, description: ev.target.value }))}
                      placeholder="Description"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        className="h-9 rounded-md border px-3"
                        type="number"
                        value={draft.amount}
                        onChange={(ev) => setDraft((d) => ({ ...d, amount: ev.target.value }))}
                        placeholder="Amount"
                      />
                      <input
                        className="h-9 rounded-md border px-3"
                        value={draft.currency}
                        onChange={(ev) => setDraft((d) => ({ ...d, currency: ev.target.value }))}
                        placeholder="Currency (e.g., INR)"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        className="h-9 rounded-md border px-3"
                        value={draft.category}
                        onChange={(ev) => setDraft((d) => ({ ...d, category: ev.target.value }))}
                        placeholder="Category"
                      />
                      <input
                        className="h-9 rounded-md border px-3"
                        type="date"
                        value={draft.date}
                        onChange={(ev) => setDraft((d) => ({ ...d, date: ev.target.value }))}
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-sm">
                    {e.description || "No description"} — {e.category || "General"}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium min-w-[100px] text-right">
                  {e.amount.amount} {e.amount.currency}
                </span>

                {isEditing ? (
                  <>
                    <Button
                      size="sm"
                      onClick={() => saveEdit(e._id)}
                      disabled={savingId === e._id}
                    >
                      {savingId === e._id ? "Saving…" : "Save"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" onClick={() => startEdit(e)}>
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(e._id)}
                      disabled={deletingId === e._id}
                    >
                      {deletingId === e._id ? "Deleting..." : "Delete"}
                    </Button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}