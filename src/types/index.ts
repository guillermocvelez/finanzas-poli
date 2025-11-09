export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: "monthly" | "weekly" | "yearly";
}

export interface UserProfile {
  name: string;
  email: string;
  currency: string;
  theme: "light" | "dark" | "system";
}

export const INCOME_CATEGORIES = [
  "Salario",
  "Freelance",
  "Inversiones",
  "Ventas",
  "Otros ingresos",
];

export const EXPENSE_CATEGORIES = [
  "Alimentación",
  "Transporte",
  "Vivienda",
  "Entretenimiento",
  "Salud",
  "Educación",
  "Ropa",
  "Servicios",
  "Otros gastos",
];
