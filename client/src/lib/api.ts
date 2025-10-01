import type { AddExpensePayload, AddExpenseResponse } from "@/types/expenses";

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