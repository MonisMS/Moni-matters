import {  useState } from "react";
import { Button } from "./button";
import { addExpense } from "@/lib/api";


type Props = {
  onadded?: () => void;
}
export default function AddExpenseForm({onadded}:Props){

const [amount,setAmount] = useState("");
const [currency,setCurrency] = useState("INR");
const [description,setDescription] = useState("");
const [category,setCategory] = useState("General");
const [date,setDate] = useState(new Date().toISOString().slice(0,10));
const [error,setError] = useState<string | null>(null);
const [success,setSuccess] = useState<string | null>(null);
const [submitting,setSubmitting] = useState(false);
const [serverError,setServerError] = useState<string | null>(null);




    const onSubmit = async (e:React.FormEvent) =>{
        e.preventDefault();
        console.log("submitted form");
        setError(null); 
        setServerError(null);
        setSuccess(null);
    
  const amountNum = Number(amount);
    if (Number.isNaN(amountNum) || amountNum <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
  const cur = currency.trim().toUpperCase();     
    if (!cur) {
      setError("Currency is required.");
      return;
    }
    const desc = description.trim();
    const cat = category.trim();
     if (!cat) {                            
      setError("Category is required.");
      return;}

      
    if (!date) {                           
      setError("Date is required.");
      return;
    }

    const dateISO = new Date(date).toISOString();
    const payload ={
        amount: amountNum,
        currency: cur,
        description:desc || undefined,
        category:cat,
        date:dateISO
    }

    try {
      setSubmitting(true);
      const res = await addExpense(payload);
      console.log("Api added:", res);
      setAmount("");
      setDescription("");
      setSuccess("Expense added successfully");
      onadded?.();
     
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setServerError(msg);
      setSuccess(null);

}finally{
  setSubmitting(false);
}
    }
    return(
       <form className="grid gap-3" onSubmit={onSubmit}>
         <div className="grid gap-1">
            <label className="text-sm" htmlFor="amount">Amount</label>
            <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="h-9 rounded-md border px-3"
          placeholder="e.g., 250"
        />
      </div>
        <div className="grid gap-1">                  
        <label className="text-sm" htmlFor="currency">Currency</label>
        <input
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="h-9 rounded-md border px-3"
          placeholder="INR"
        />
      </div>

       <div className="grid gap-1">
        <label className="text-sm" htmlFor="description">Description (optional)</label>
        <input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-9 rounded-md border px-3"
          placeholder="Coffee, metro, etc."
        />
      </div>
     <div className="grid gap-1">
        <label className="text-sm" htmlFor="category">Category</label>
        <input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-9 rounded-md border px-3"
          placeholder="e.g., Food, Transport…"
        />
      </div>
      <div className="grid gap-1">
        <label className="text-sm" htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)} // HINT: store as "yyyy-mm-dd"
          className="h-9 rounded-md border px-3"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}
        <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
        {submitting ? "saving..." : "Add expenses"}
        </Button>
        </div>
       </form>

    )
}