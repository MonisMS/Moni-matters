export type AddExpensePayload = {
  amount: number;
  currency: string;
  description?: string;
  category: string;
  date: string; // ISO string
}

export type AddExpenseResponse = {
  message: string;
  expense: {
    _id: string;
    description?: string;
    amount: { amount: number; currency: string };
    category?: string;
    date: string;
    createdAt: string;
    updatedAt: string;
  };
};
export type Expense = {
_id: string;
  description?: string;
  amount: { amount: number; currency: string };
  category?: string;
  date: string;        // ISO string from server
  createdAt: string;
  updatedAt: string;
}

export type GetExpensesResponse ={
     message: string;
  expenses: Expense[];
}