export interface Money {
  amount: number;
  currency: string;
}
export interface Expense {
  id: string;
  description?: string;
  amount: Money;
  category?: string;
  date: Date;
}

// export interface Category {
//     category: string;
//     totalAmount: Money;
// }

// export interface Budget {
//   id: string;
//     totalBudget: Money;
//     spentAmount: Money;
//     remainingAmount: Money;
//     startDate: Date;
//     endDate: Date;
// }

