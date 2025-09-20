import { useEffect, useState } from "react"
import axios from "axios"
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
  return axios.get("http://localhost:5000/api/transaction/", { withCredentials: true }).then((res) => {
    return res.data
  })
}

interface Category {
  id: number
  name: string
  type: string
}

function getCategories() {
  return axios.get("http://localhost:5000/api/transaction/categories", { withCredentials: true }).then((res) => {
    return res.data
  })
}

const SpendingFormSchema = z.object({
  type: z.string(),
  amount: z.coerce.number<number>().min(0, "Amount must be positive"),
  description: z.string().max(1000).optional(),
  category: z.string().min(1, "Category is required"),
  date: z.date("Date is required"),
})

const CategoryFormSchema = z.object({
  type: z.string(),
  name: z.string().min(1, "Category name is required").max(50, "Category name is too long"),
})

export default function TransactionPage() {
  const [data, setData] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [dialogHeader, setDialogHeader] = useState("Spending")
  const [open, setOpen] = useState(false)
  const [openCategoryPopover, setOpenCategoryPopover] = useState(false)

  // Fetch transactions
  useEffect(() => {
    getData().then(setData)
  }, [])

  // Fetch categories (by user)
  useEffect(() => {
    getCategories().then(setCategories)
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

  const categoryForm = useForm<z.infer<typeof CategoryFormSchema>>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: "",
      type: "",
    },
  });

  async function onSubmit(data: z.infer<typeof SpendingFormSchema>) {
    console.log(data)
    try {
      await axios.post(
        "http://localhost:5000/api/transaction/create",
        data,
        { withCredentials: true }
      );
      getData().then(setData);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert("Transaction creation failed.");
      return;
    }
    setOpen(false)
    spendingForm.reset()
  }

  async function onCategorySubmit(data: z.infer<typeof CategoryFormSchema>) {
    try {
      await axios.post(
        "http://localhost:5000/api/transaction/create-category",
        data,
        { withCredentials: true }
      );
      getCategories().then(setCategories)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert("Category creation failed.");
      return;
    }
    setOpenCategoryPopover(false)
    categoryForm.reset()
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <DataTable columns={columns} data={data} />
      <Button
        onClick={() => {
          setDialogHeader("Spending")
          setOpen(true)
          spendingForm.reset({
            amount: 0,
            type: "Expense",
            description: "",
            category: "",
            date: new Date(),
          })
          categoryForm.reset({
            name: "",
            type: "Expense",
          })
        }}
      >
        <PlusIcon /> Add Spending
      </Button>

      <Button
        onClick={() => {
          setDialogHeader("Income")
          setOpen(true)
          spendingForm.reset({
            amount: 0,
            type: "Income",
            description: "",
            category: "",
            date: new Date(),
          })
          categoryForm.reset({
            name: "",
            type: "Income",
          })
        }}
      >
        <PlusIcon /> Add Income
      </Button>


      {/* Spending Form */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add {dialogHeader}</DialogTitle>
            <DialogDescription>
              Add a new {dialogHeader.toLowerCase()} to your account.
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
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          {  spendingForm.getValues("type") === "Income" ?
                            <SelectContent>
                              {categories.filter(cat => cat.type === "Income").map((category) => (
                                <SelectItem key={category.id} value={String(category.id)}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                            :
                            <SelectContent>
                              {categories.filter(cat => cat.type === "Expense").map((category) => (
                                <SelectItem key={category.id} value={String(category.id)}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          }
                        </Select>
                      </FormControl>

                      {/* Add Category Button */}
                      <Popover open={openCategoryPopover} onOpenChange={setOpenCategoryPopover}>
                        <PopoverTrigger asChild>
                          <Button type="button" variant="outline" size="sm">
                            <PlusIcon />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Form {...categoryForm}>
                            <div className="p-4 space-y-4">
                              {/* Type */}
                              <FormField
                                control={categoryForm.control}
                                name="type"
                                render={({ field }) => <Input {...field} type="hidden" />}
                              />
                              {/* Name */}
                              <FormField
                                control={categoryForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter category name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button
                                type="button"
                                className="w-full"
                                onClick={() => categoryForm.handleSubmit(onCategorySubmit)()}
                              >
                                Add
                              </Button>
                            </div>
                          </Form>
                        </PopoverContent>
                      </Popover>

                    </div>
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
