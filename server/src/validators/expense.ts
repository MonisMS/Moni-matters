import { z } from "zod";

export const addExpenseSchema = z.object({
  amount: z.coerce
    .number()
    .refine((n) => Number.isFinite(n), "Amount must be a number")
    .refine((n) => n > 0, "Amount must be greater than 0"),
  currency: z.string().min(1, "Currency is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  date: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), "Date must be an ISO datetime string"),
});

export const updateExpenseSchema = addExpenseSchema.partial();

export type AddExpenseInput = z.infer<typeof addExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;