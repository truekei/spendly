import  { type ColumnDef } from "@tanstack/react-table"

export type Transaction = {
  amount: number
  type: "Income" | "Expense"
  description: string | null
  category: string
  date: string
}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "category.name",
    header: "Category",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
]