import { useEffect, useState } from "react"
import { type Transaction, columns } from "./columns"
import { DataTable } from "./data-table"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, PlusIcon } from "lucide-react"

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

const SpendingFormSchema = z.object({
  type: z.string(),
  amount: z.coerce.number<number>().min(0, "Amount must be positive"),
  description: z.string().max(1000).optional(),
  category: z.string().min(1, "Category is required"),
  date: z.date("Date is required"),
})

export default function TransactionPage() {
  const [data, setData] = useState<Transaction[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    getData().then(setData)
  }, [])

  const spendingForm = useForm<z.infer<typeof SpendingFormSchema>>({
    resolver: zodResolver(SpendingFormSchema),
    defaultValues: {
      amount: 0,
      type: "",
      description: "",
      category: "",
      date: new Date(),
    },
  });

  async function onSubmit(data: z.infer<typeof SpendingFormSchema>) {
    console.log(data)
    setOpen(false)
    spendingForm.reset()
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <DataTable columns={columns} data={data} />
      <Button
        onClick={() => {
          setOpen(true)
          spendingForm.reset({
            amount: 0,
            type: "Expense",
            description: "",
            category: "",
            date: new Date(),
          })
        }}
      >
        <PlusIcon /> Add Spending
      </Button>

      <Button
        onClick={() => {
          setOpen(true)
          spendingForm.reset({
            amount: 0,
            type: "Income",
            description: "",
            category: "",
            date: new Date(),
          })
        }}
      >
        <PlusIcon /> Add Income
      </Button>


      {/* Spending Form */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add spending</DialogTitle>
            <DialogDescription>
              Add a new spending to your account.
            </DialogDescription>
          </DialogHeader>
          <Form {...spendingForm}>
            <form onSubmit={spendingForm.handleSubmit(onSubmit)} className="space-y-8">
              {/* Type */}
              <FormField
                control={spendingForm.control}
                name="type"
                render={({ field }) => (
                  <Input {...field} type="hidden" />
                )}
              />
              {/* Amount */}
              <FormField
                control={spendingForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Category */}
              <FormField
                control={spendingForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="food">Food</SelectItem>
                          <SelectItem value="transport">Transport</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Description */}
              <FormField
                control={spendingForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Type description here (optional)." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Date */}
              <FormField
                control={spendingForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Add Spending</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
