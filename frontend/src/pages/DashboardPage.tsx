import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDown, ArrowUp, Download } from "lucide-react";
import { useEffect, useState } from "react";

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

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth().toString()
  );

  useEffect(() => {
    // debug
    console.log(monthOptions.find((m) => m.value === selectedMonth));
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
            defaultValue="0"
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
      <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardDescription className="text-md text-black">
              Income This Month{" "}
              <Badge>
                <ArrowUp />
                5%
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">IDR 4.550.000,00</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="text-md text-black">
              Spending This Month{" "}
              <Badge>
                <ArrowDown />
                5%
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">IDR 983.500,00</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
