import { useEffect, useState } from "react"
import { type Transaction, columns } from "./columns"
import { DataTable } from "./data-table"

function getData(): Promise<Transaction[]> {
  return Promise.resolve([
    {
      amount: 12000,
      type: "Income",
      description: "Salary",
      category: "Job",
      date: "2023-01-01",
    },
  ])
}

export default function TransactionPage() {
  const [data, setData] = useState<Transaction[]>([])

  useEffect(() => {
    getData().then(setData)
  }, [])

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
