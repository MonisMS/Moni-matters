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