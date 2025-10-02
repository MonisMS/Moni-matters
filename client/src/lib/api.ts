import type { AddExpensePayload, AddExpenseResponse, GetExpensesResponse, UpdateExpensePayload, UpdateExpenseResponse } from "@/types/expenses";

const BASE_URL= import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  
  if (!res.ok) {
    // If server responds with an error body, surface it
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}
export function addExpense(payload: AddExpensePayload) {
  return http<AddExpenseResponse>(`${BASE_URL}/expenses/add`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


export function listExpenses() {
return http<GetExpensesResponse>(`${BASE_URL}/expenses/get`);
}
export function deletedExpense (id:string) {
  return http<{message:string}>(`${BASE_URL}/expenses/${id}`,{
    method:"DELETE",
  })
}
export function updateExpense(id: string, payload: UpdateExpensePayload) {
  return http<UpdateExpenseResponse>(`${BASE_URL}/expenses/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}