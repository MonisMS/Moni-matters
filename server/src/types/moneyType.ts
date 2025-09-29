import type { Double } from "mongoose";

export interface Money {
    amount: Double;
    currency: string;
}
