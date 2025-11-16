import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon, Plus, PlusIcon, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { type Transaction, columns } from "./columns";
import { DataTable } from "./data-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faPiggyBank } from "@fortawesome/free-solid-svg-icons";

interface Category {
  id: number;
  name: string;
  type: string;
}

const SpendingFormSchema = z.object({
  type: z.string(),
  amount: z.coerce.number<number>().min(0, "Amount must be positive"),
  description: z.string().max(1000).optional(),
  category: z.string().min(1, "Category is required"),
  date: z.date("Date is required"),
});

const CategoryFormSchema = z.object({
  type: z.string(),
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Category name is too long"),
});

export default function TransactionPage() {
  const [data, setData] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogHeader, setDialogHeader] = useState("Spending");
  const [showTransactionTypeDialog, setShowTransactionTypeDialog] =
    useState(false);
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const [openCategoryPopover, setOpenCategoryPopover] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [searchQuery, setSearchQuery] = useState("");

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const yearSelections = ["2025", "2024", "2023"];

  // Fetch transactions
  useEffect(() => {
    getData().then(setData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, searchQuery]);

  // Fetch categories (by user)
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

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

  function getData(): Promise<Transaction[]> {
    const url = `${
      import.meta.env.VITE_API_URL
    }/transaction?year=${selectedYear}&search=${searchQuery}`;
    return axios.get(url, { withCredentials: true }).then((res) => {
      return res.data;
    });
  }

  function getCategories() {
    const url = `${import.meta.env.VITE_API_URL}/transaction/category`;
    return axios
      .get(url, {
        withCredentials: true,
      })
      .then((res) => {
        return res.data;
      });
  }

  async function onSubmit(data: z.infer<typeof SpendingFormSchema>) {
    console.log(data);
    const url = `${import.meta.env.VITE_API_URL}/transaction`;
    try {
      await axios.post(url, data, {
        withCredentials: true,
      });
      getData().then(setData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert("Transaction creation failed.");
      return;
    }
    setShowTransactionDialog(false);
    spendingForm.reset();
  }

  async function onCategorySubmit(data: z.infer<typeof CategoryFormSchema>) {
    const url = `${import.meta.env.VITE_API_URL}/transaction/category`;
    try {
      await axios.post(url, data, { withCredentials: true });
      getCategories().then(setCategories);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert("Category creation failed.");
      return;
    }
    setOpenCategoryPopover(false);
    categoryForm.reset();
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(value);
    }, 500);
  };

  return (
    <Layout>
      <div className="relative z-0 px-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Transactions</h1>
          <div className="flex space-x-4">
            <Button
              className="w-fit"
              onClick={() => {
                setShowTransactionTypeDialog(true);
              }}
            >
              <Plus />
              New Transaction
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between w-full border-b">
            <div>
              <Button
                variant={"ghost"}
                onClick={() => {
                  setSelectedYear("");
                }}
                className={`rounded-none hover:text-primary ${
                  selectedYear === "" && "text-primary border-b border-primary"
                }`}
              >
                All Year
              </Button>
              {yearSelections.map((year) => (
                <Button
                  variant={"ghost"}
                  onClick={() => {
                    setSelectedYear(year);
                  }}
                  className={`rounded-none hover:text-primary ${
                    selectedYear === year &&
                    "text-primary border-b border-primary"
                  }`}
                >
                  {year}
                </Button>
              ))}
            </div>
            <div className="flex w-full max-w-sm items-center gap-2 justify-end">
              <Input
                type="text"
                placeholder="Find transactions..."
                onChange={handleSearchChange}
                className="border-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0"
              />
              <Search className="text-muted-foreground" />
            </div>
          </div>
          <DataTable columns={columns} data={data} />
        </div>

        {/* Choose Transaction Type (Income/Expense) */}
        <Dialog
          open={showTransactionTypeDialog}
          onOpenChange={setShowTransactionTypeDialog}
        >
          <DialogContent className="lg:min-w-xl md:min-w-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">
                Choose Transaction Type
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-8 items-right mt-4 mx-4">
              <div className="space-y-2">
                <button
                  className="border-4 border-primary w-full rounded-lg px-2 py-5 cursor-pointer text-primary hover:bg-primary hover:text-background-light transition"
                  onClick={() => {
                    setDialogHeader("Spending");
                    setShowTransactionDialog(true);
                    setShowTransactionTypeDialog(false);
                    spendingForm.reset({
                      amount: 0,
                      type: "Expense",
                      description: "",
                      category: "",
                      date: new Date(),
                    });
                    categoryForm.reset({
                      name: "",
                      type: "Expense",
                    });
                  }}
                >
                  <FontAwesomeIcon icon={faCartShopping} size={"9x"} />
                </button>
                <p className="text-center text-2xl uppercase">Spending</p>
              </div>
              <div className="space-y-2">
                <button
                  className="border-4 border-primary w-full rounded-lg px-2 py-5 cursor-pointer text-primary hover:bg-primary hover:text-background-light transition"
                  onClick={() => {
                    setDialogHeader("Income");
                    setShowTransactionDialog(true);
                    setShowTransactionTypeDialog(false);
                    spendingForm.reset({
                      amount: 0,
                      type: "Income",
                      description: "",
                      category: "",
                      date: new Date(),
                    });
                    categoryForm.reset({
                      name: "",
                      type: "Income",
                    });
                  }}
                >
                  <FontAwesomeIcon icon={faPiggyBank} size={"9x"} />
                </button>
                <p className="text-center text-2xl uppercase">Income</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Spending Form */}
        <Dialog
          open={showTransactionDialog}
          onOpenChange={setShowTransactionDialog}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add {dialogHeader}</DialogTitle>
              <DialogDescription>
                Add a new {dialogHeader.toLowerCase()} to your account.
              </DialogDescription>
            </DialogHeader>
            <Form {...spendingForm}>
              <form
                onSubmit={spendingForm.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Type */}
                <FormField
                  control={spendingForm.control}
                  name="type"
                  render={({ field }) => <Input {...field} type="hidden" />}
                />
                {/* Amount */}
                <FormField
                  control={spendingForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          {...field}
                        />
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
                            {spendingForm.getValues("type") === "Income" ? (
                              <SelectContent>
                                {categories
                                  .filter((cat) => cat.type === "Income")
                                  .map((category) => (
                                    <SelectItem
                                      key={category.id}
                                      value={String(category.id)}
                                    >
                                      {category.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            ) : (
                              <SelectContent>
                                {categories
                                  .filter((cat) => cat.type === "Expense")
                                  .map((category) => (
                                    <SelectItem
                                      key={category.id}
                                      value={String(category.id)}
                                    >
                                      {category.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            )}
                          </Select>
                        </FormControl>

                        {/* Add Category Button */}
                        <Popover
                          open={openCategoryPopover}
                          onOpenChange={setOpenCategoryPopover}
                        >
                          <PopoverTrigger asChild>
                            <Button type="button" variant="ghost">
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
                                  render={({ field }) => (
                                    <Input {...field} type="hidden" />
                                  )}
                                />
                                {/* Name */}
                                <FormField
                                  control={categoryForm.control}
                                  name="name"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                      <FormLabel>Category Name</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Enter category name"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <Button
                                  type="button"
                                  className="w-full"
                                  onClick={() =>
                                    categoryForm.handleSubmit(
                                      onCategorySubmit
                                    )()
                                  }
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
                        <Textarea
                          placeholder="Type description here (optional)."
                          {...field}
                        />
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
                <Button type="submit" className="w-full">
                  Add {dialogHeader}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
