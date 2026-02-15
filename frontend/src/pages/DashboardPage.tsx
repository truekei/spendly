import { Badge } from "@/components/ui/badge";
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
type CategoryItem = {
  category: string;
  amount: number;
};
type CategoryChartData = {
  category: string;
  amount: number;
  fill: string;
};
type BarChartData = {
  month: string;
  income: number;
  spending: number;
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

  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [balanceChartData, setBalanceChartData] = useState<BalanceChartData[]>(
    [],
  );
  const [spendingChartData, setSpendingChartData] = useState<
    CategoryChartData[]
  >([]);
  const [spendingChartConfig, setSpendingChartConfig] = useState<ChartConfig>(
    {},
  );
  const [incomeChartData, setIncomeChartData] = useState<CategoryChartData[]>(
    [],
  );
  const [incomeChartConfig, setIncomeChartConfig] = useState<ChartConfig>({});
  const [barChartData, setBarChartData] = useState<BarChartData[]>([]);

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
  const fetchSpendingIncomeByCategory = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/dashboard/spending-income-by-category`;
      const params: Record<string, string> = {};
      params.month = selectedMonth;
      params.year = "2025"; // hardcoded for now
      const res = await axios.get(url, {
        params,
        withCredentials: true,
      });
      if (res.status === 200) {
        const maxCategories = 4;
        console.log(res.data);

        // Set spending chart data and config
        setSpendingChartData(
          buildCategoryChartData(res.data.spendingByCategory, maxCategories),
        );
        const config: ChartConfig = buildCategoryChartConfig(
          res.data.spendingByCategory,
          maxCategories,
        );
        setSpendingChartConfig(config);
        console.log("spending chart config", config);

        // Set income chart data and config
        setIncomeChartData(
          buildCategoryChartData(res.data.incomeByCategory, maxCategories),
        );
        const incomeConfig: ChartConfig = buildCategoryChartConfig(
          res.data.incomeByCategory,
          maxCategories,
        );
        setIncomeChartConfig(incomeConfig);
        console.log("income chart config", incomeConfig);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const fetchIncomeVsSpending = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/dashboard/income-vs-spending`;
      const params: Record<string, string> = {};
      params.year = "2025"; // hardcoded for now
      const res = await axios.get(url, {
        params,
        withCredentials: true,
      });
      if (res.status === 200) {
        console.log(res.data);
        console.log(
          res.data.incomeVsSpending.map((item: BarChartData) => ({
            month: monthOptions.find((m) => m.value === item.month)?.label,
            income: item.income,
            spending: item.spending,
          })),
        );
        setBarChartData(
          res.data.incomeVsSpending.map((item: BarChartData) => ({
            month: monthOptions.find((m) => m.value === item.month)?.label,
            income: item.income,
            spending: item.spending,
          })),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };
  const buildCategoryChartData = (
    data: CategoryItem[],
    maxCategories: number,
  ): CategoryChartData[] => {
    const top = data.slice(0, maxCategories);
    const rest = data.slice(maxCategories);

    const otherAmount = rest.reduce(
      (sum: number, item: CategoryItem) => sum + item.amount,
      0,
    );

    const result: CategoryChartData[] = top.map((item: CategoryItem) => ({
      ...item,
      fill: `var(--color-${item.category})`,
    }));

    if (otherAmount > 0) {
      result.push({
        category: "other",
        amount: otherAmount,
        fill: "var(--color-other)",
      });
    }

    return result;
  };
  const buildCategoryChartConfig = (
    data: CategoryItem[],
    maxCategories: number,
  ): ChartConfig => {
    const config: ChartConfig = {};
    data.forEach((item: CategoryItem, index: number) => {
      if (index < maxCategories) {
        config[item.category as keyof typeof config] = {
          label: item.category.charAt(0).toUpperCase() + item.category.slice(1),
          color: `var(--chart-${index + 1})`,
        };
      } else if (index === maxCategories) {
        config["other"] = {
          label: "Other",
          color: "var(--chart-5)",
        };
      }
    });
    return config;
  };

  const balanceChartConfig = {
    balance: {
      label: "Balance",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;
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
    fetchSpendingIncomeByCategory();
  }, [selectedMonth]);

  useEffect(() => {
    fetchIncomeVsSpending();
  }, []);

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
          {/* <Button className="w-fit">
            <Download />
            Export
          </Button> */}
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
                    domain={["dataMin", "auto"]}
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
                    type="monotone"
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
            {spendingChartData.length === 0 ? (
              <div className="flex items-center justify-center h-50">
                <p className="text-muted-foreground">No data available.</p>
              </div>
            ) : (
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
            )}
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
            {incomeChartData.length === 0 ? (
              <div className="flex items-center justify-center h-50">
                <p className="text-muted-foreground">No data available.</p>
              </div>
            ) : (
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
            )}
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
            {barChartData.length === 0 ? (
              <div className="flex items-center justify-center h-50">
                <p className="text-muted-foreground">No data available.</p>
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
