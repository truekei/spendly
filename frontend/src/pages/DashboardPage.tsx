import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import {
  faCartShopping,
  faPiggyBank,
  faScaleUnbalanced,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

type SummaryData = {
  expense: {
    total: number;
    percentage: number;
  };
  income: {
    total: number;
    percentage: number;
  };
};
type BalanceChartData = {
  day: string;
  balance: bigint;
};

export default function DashboardPage() {
  // const currentDate = new Date().toISOString().split("T")[0];
  const monthOptions = [
    {
      value: "0",
      label: "January",
    },
    {
      value: "1",
      label: "February",
    },
    {
      value: "2",
      label: "March",
    },
    {
      value: "3",
      label: "April",
    },
    {
      value: "4",
      label: "May",
    },
    {
      value: "5",
      label: "June",
    },
    {
      value: "6",
      label: "July",
    },
    {
      value: "7",
      label: "August",
    },
    {
      value: "8",
      label: "September",
    },
    {
      value: "9",
      label: "October",
    },
    {
      value: "10",
      label: "November",
    },
    {
      value: "11",
      label: "December",
    },
  ];

  const currentMonth = new Date().getMonth().toString();

  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [balanceChartData, setBalanceChartData] = useState<BalanceChartData[]>(
    [],
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);

  const fetchTotalIncomeExpense = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/dashboard/income-expense`;
      const params: Record<string, string> = {};
      params.month = selectedMonth;
      params.year = "2025"; // hardcoded for now
      const res = await axios.get(url, {
        params,
        withCredentials: true,
      });
      if (res.status === 200) {
        console.log(res.data);
        setSummaryData(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const fetchBalanceFlow = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/dashboard/balance-flow`;
      const params: Record<string, string> = {};
      params.month = selectedMonth;
      params.year = "2025"; // hardcoded for now
      const res = await axios.get(url, {
        params,
        withCredentials: true,
      });
      if (res.status === 200) {
        console.log(res.data);
        setBalanceChartData(res.data.balances);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // const balanceChartData = [
  //   { day: "1", balance: 1860000 },
  //   { day: "2", balance: 3050000 },
  //   { day: "3", balance: 2370000 },
  //   { day: "4", balance: 730000 },
  //   { day: "5", balance: 2090000 },
  //   { day: "6", balance: 2140000 },
  //   { day: "7", balance: 3670000 },
  //   { day: "8", balance: 4560000 },
  //   { day: "9", balance: 3490000 },
  //   { day: "10", balance: 2900000 },
  //   { day: "11", balance: 4100000 },
  //   { day: "12", balance: 3670000 },
  //   { day: "13", balance: 3120000 },
  //   { day: "14", balance: 3100000 },
  //   { day: "15", balance: 2890000 },
  //   { day: "16", balance: 2230000 },
  //   { day: "17", balance: 1890000 },
  //   { day: "18", balance: 1210000 },
  //   { day: "19", balance: 900000 },
  //   { day: "20", balance: 500000 },
  //   { day: "21", balance: 100000 },
  //   { day: "22", balance: 700000 },
  //   { day: "23", balance: 1200000 },
  //   { day: "24", balance: 1000000 },
  //   { day: "25", balance: 1500000 },
  //   { day: "26", balance: 2000000 },
  //   { day: "27", balance: 2500000 },
  //   { day: "28", balance: 3000000 },
  //   { day: "29", balance: 3500000 },
  //   { day: "30", balance: 4000000 },
  //   { day: "31", balance: 4500000 },
  // ];

  const balanceChartConfig = {
    balance: {
      label: "Balance",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const spendingChartData = [
    { category: "groceries", amount: 275000, fill: "var(--color-groceries)" },
    { category: "food", amount: 200000, fill: "var(--color-food)" },
    { category: "hobbies", amount: 187000, fill: "var(--color-hobbies)" },
    {
      category: "transportation",
      amount: 173000,
      fill: "var(--color-transportation)",
    },
    { category: "other", amount: 177000, fill: "var(--color-other)" },
  ];

  const spendingChartConfig = {
    amount: {
      label: "Amount",
      color: "var(--muted-foreground)",
    },
    groceries: {
      label: "Groceries",
      color: "var(--chart-1)",
    },
    food: {
      label: "Food",
      color: "var(--chart-2)",
    },
    hobbies: {
      label: "Hobbies",
      color: "var(--chart-3)",
    },
    transportation: {
      label: "Transportation",
      color: "var(--chart-4)",
    },
    other: {
      label: "Other",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig;

  const incomeChartData = [
    { category: "salary", amount: 1860000, fill: "var(--color-salary)" },
    {
      category: "reimbursement",
      amount: 273000,
      fill: "var(--color-reimbursement)",
    },
    {
      category: "investment",
      amount: 237000,
      fill: "var(--color-investment)",
    },
    { category: "bonus", amount: 30500, fill: "var(--color-bonus)" },
  ];

  const incomeChartConfig = {
    amount: {
      label: "Amount",
      color: "var(--muted-foreground)",
    },
    salary: {
      label: "Salary",
      color: "var(--chart-1)",
    },
    reimbursement: {
      label: "Reimbursement",
      color: "var(--chart-2)",
    },
    investment: {
      label: "Investment",
      color: "var(--chart-3)",
    },
    bonus: {
      label: "Bonus",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  const barChartData = [
    { month: "January", income: 1860000, spending: 800000 },
    // { month: "February", income: 2050000, spending: 950000 },
    // { month: "March", income: 2370000, spending: 1100000 },
    // { month: "April", income: 1730000, spending: 700000 },
    // { month: "May", income: 2090000, spending: 1200000 },
    // { month: "June", income: 2140000, spending: 1300000 },
    // { month: "July", income: 2670000, spending: 1500000 },
    // { month: "August", income: 2560000, spending: 1400000 },
    // { month: "September", income: 2490000, spending: 1350000 },
    // { month: "October", income: 2900000, spending: 1600000 },
    // { month: "November", income: 3100000, spending: 1700000 },
    // { month: "December", income: 3670000, spending: 1900000 },
  ];

  const barChartConfig = {
    income: {
      label: "Income",
      color: "var(--chart-1)",
    },
    spending: {
      label: "Spending",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

  useEffect(() => {
    // debug
    console.log(monthOptions.find((m) => m.value === selectedMonth));
    fetchTotalIncomeExpense();
    fetchBalanceFlow();
  }, [selectedMonth]);

  return (
    <div className="relative z-0 px-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Overview</h1>
        <div className="flex space-x-4">
          <Select
            onValueChange={(value) => {
              setSelectedMonth(value);
            }}
            defaultValue={selectedMonth}
          >
            <SelectTrigger className="w-fit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Filter by Month</SelectLabel>
                {monthOptions.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button className="w-fit">
            <Download />
            Export
          </Button>
        </div>
      </div>
      <div className="grid xl:grid-cols-6 lg:grid-cols-2 md:grid-cols-1 gap-4 overflow-x-auto">
        <Card className="flex flex-col xl:col-span-4 lg:col-span-2 md:col-span-1">
          <CardHeader className="items-center">
            <CardTitle className="text-xl space-x-2">
              <FontAwesomeIcon icon={faWallet} />
              <span>Balance Flow</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {balanceChartData.length === 0 ? (
              <div className="flex items-center justify-center h-50">
                <p className="text-muted-foreground">No data available.</p>
              </div>
            ) : (
              <ChartContainer
                config={balanceChartConfig}
                className="max-h-50 w-full"
              >
                <LineChart
                  accessibilityLayer
                  data={balanceChartData}
                  margin={{
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                  }}
                >
                  <XAxis dataKey="day" minTickGap={15} />
                  <YAxis
                    tickMargin={10}
                    width={120}
                    tickFormatter={(value) =>
                      `${formatCurrency(value, "id-ID", "IDR")}`
                    }
                    tickCount={4}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        hideIndicator
                        labelFormatter={(label) => `Day ${label}`}
                        formatter={(value, name) => {
                          return (
                            <div className="flex">
                              <span className="mr-2 text-muted-foreground">
                                {balanceChartConfig[
                                  name as keyof typeof balanceChartConfig
                                ]?.label ?? name}
                              </span>
                              <span className="font-bold">
                                {formatCurrency(Number(value), "id-ID", "IDR")}
                              </span>
                            </div>
                          );
                        }}
                      />
                    }
                  />
                  <Line
                    dataKey="balance"
                    type="natural"
                    stroke="var(--color-balance)"
                    dot={false}
                    strokeWidth={2}
                    filter="url(#rainbow-line-glow)"
                  />
                  <defs>
                    <filter
                      id="rainbow-line-glow"
                      x="-20%"
                      y="-20%"
                      width="140%"
                      height="140%"
                    >
                      <feGaussianBlur stdDeviation="10" result="blur" />
                      <feComposite
                        in="SourceGraphic"
                        in2="blur"
                        operator="over"
                      />
                    </filter>
                  </defs>
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
        <div className="grid xl:grid-cols-1 lg:grid-cols-2 gap-4 xl:col-span-2 lg:col-span-2 md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-foreground space-x-2">
                <ArrowUpRight />
                <span>Total Spending</span>
                <Badge
                  className={`border-none ml-2 text-sm ${summaryData?.expense.percentage && Number(summaryData?.expense.percentage) > 0 ? "text-red-500 bg-red-500/10" : "text-green-500 bg-green-500/10"}`}
                >
                  {summaryData?.expense.percentage &&
                  Number(summaryData?.expense.percentage) < 0 ? (
                    <TrendingDown size={100} />
                  ) : (
                    <TrendingUp size={100} />
                  )}
                  <span>{Math.abs(summaryData?.expense.percentage || 0)}%</span>
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {formatCurrency(
                  summaryData?.expense.total || 0,
                  "id-ID",
                  "IDR",
                )}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-foreground space-x-2">
                <ArrowDownLeft />
                <span>Total Income</span>
                <Badge
                  className={`text-green-500 bg-green-500/10 border-none ml-2 text-sm ${summaryData?.income.percentage && Number(summaryData?.income.percentage) < 0 ? "text-red-500 bg-red-500/10" : "text-green-500 bg-green-500/10"}`}
                >
                  {summaryData?.income.percentage &&
                  Number(summaryData?.income.percentage) < 0 ? (
                    <TrendingDown />
                  ) : (
                    <TrendingUp />
                  )}
                  <span>{Math.abs(summaryData?.income.percentage || 0)}%</span>
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {formatCurrency(summaryData?.income.total || 0, "id-ID", "IDR")}
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="flex flex-col xl:col-span-2 lg:col-span-1">
          <CardHeader className="items-center">
            <CardTitle className="text-xl space-x-2">
              <FontAwesomeIcon icon={faCartShopping} />
              <span>Spending By Category</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer
              config={spendingChartConfig}
              className="[&_.recharts-text]:fill-background"
            >
              <PieChart>
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ paddingLeft: 20 }}
                  content={(props) => {
                    const { payload } = props;
                    return (
                      <ul>
                        {payload?.map((entry, index) => (
                          <li
                            key={`item-${index}`}
                            className="my-2 flex items-center"
                            style={{ color: entry.color }}
                          >
                            <span
                              style={{
                                backgroundColor: entry.color,
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                display: "inline-block",
                              }}
                            >
                              &nbsp;
                            </span>
                            <span className="mx-2 font-medium">
                              {spendingChartConfig[
                                entry.value as keyof typeof spendingChartConfig
                              ]?.label ?? entry.value}
                            </span>
                          </li>
                        ))}
                      </ul>
                    );
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value, name) => {
                        return (
                          <div className="flex">
                            <span
                              style={{
                                backgroundColor:
                                  spendingChartConfig[
                                    name as keyof typeof spendingChartConfig
                                  ]?.color ?? "var(--muted-foreground)",
                                width: 5,
                                height: "auto",
                                display: "inline-block",
                              }}
                            >
                              &nbsp;
                            </span>
                            <span className="mx-2 text-muted-foreground">
                              {spendingChartConfig[
                                name as keyof typeof spendingChartConfig
                              ]?.label ?? name}
                            </span>
                            <span className="font-bold">
                              {formatCurrency(Number(value), "id-ID", "IDR")}
                            </span>
                          </div>
                        );
                      }}
                    />
                  }
                />
                <Pie
                  data={spendingChartData}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={20}
                  cornerRadius={4}
                  paddingAngle={4}
                ></Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="xl:col-span-2 lg:col-span-1">
          <CardHeader className="items-center">
            <CardTitle className="text-xl space-x-2">
              <FontAwesomeIcon icon={faPiggyBank} />
              <span>Income By Category</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-0">
            <ChartContainer
              config={incomeChartConfig}
              className="[&_.recharts-text]:fill-background"
            >
              <PieChart>
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ paddingLeft: 20 }}
                  content={(props) => {
                    const { payload } = props;
                    return (
                      <ul>
                        {payload?.map((entry, index) => (
                          <li
                            key={`item-${index}`}
                            className="my-2 flex items-center"
                            style={{ color: entry.color }}
                          >
                            <span
                              style={{
                                backgroundColor: entry.color,
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                display: "inline-block",
                              }}
                            >
                              &nbsp;
                            </span>
                            <span className="mx-2 font-medium">
                              {incomeChartConfig[
                                entry.value as keyof typeof incomeChartConfig
                              ]?.label ?? entry.value}
                            </span>
                          </li>
                        ))}
                      </ul>
                    );
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value, name) => {
                        return (
                          <div className="flex">
                            <span
                              style={{
                                backgroundColor:
                                  incomeChartConfig[
                                    name as keyof typeof incomeChartConfig
                                  ]?.color ?? "var(--muted-foreground)",
                                width: 5,
                                height: "auto",
                                display: "inline-block",
                              }}
                            >
                              &nbsp;
                            </span>
                            <span className="mx-2 text-muted-foreground">
                              {incomeChartConfig[
                                name as keyof typeof incomeChartConfig
                              ]?.label ?? name}
                            </span>
                            <span className="font-bold">
                              {formatCurrency(Number(value), "id-ID", "IDR")}
                            </span>
                          </div>
                        );
                      }}
                    />
                  }
                />
                <Pie
                  data={incomeChartData}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={20}
                  cornerRadius={4}
                  paddingAngle={4}
                ></Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="xl:col-span-2 lg:col-span-2 md:col-span-1">
          <CardHeader className="items-center">
            <CardTitle className="text-xl space-x-2">
              <FontAwesomeIcon icon={faScaleUnbalanced} />
              <span>Income vs Spending</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig}>
              <BarChart
                accessibilityLayer
                data={barChartData}
                layout="vertical"
                margin={{ left: -15, right: 0, top: 0, bottom: 0 }}
              >
                <YAxis
                  type="category"
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <XAxis
                  type="number"
                  tickMargin={10}
                  tickFormatter={(value) =>
                    `${formatCurrency(value, "id-ID", "IDR")}`
                  }
                  tickCount={4}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        return (
                          <div className="flex">
                            <span
                              style={{
                                backgroundColor:
                                  barChartConfig[
                                    name as keyof typeof barChartConfig
                                  ]?.color ?? "var(--muted-foreground)",
                                width: 5,
                                height: "auto",
                                display: "inline-block",
                              }}
                            >
                              &nbsp;
                            </span>
                            <span className="mx-2 text-muted-foreground">
                              {barChartConfig[
                                name as keyof typeof barChartConfig
                              ]?.label ?? name}
                            </span>
                            <span className="font-bold">
                              {formatCurrency(Number(value), "id-ID", "IDR")}
                            </span>
                          </div>
                        );
                      }}
                    />
                  }
                />
                <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                <Bar
                  dataKey="spending"
                  fill="var(--color-spending)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
