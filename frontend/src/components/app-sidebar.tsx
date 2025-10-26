import SpendlyLogo from "/spendly_blacktext.svg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChartPie,
  LayoutDashboard,
  BadgeDollarSign,
  NotepadText,
  Settings,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserGroup } from "@fortawesome/free-solid-svg-icons";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: LayoutDashboard,
  },
  {
    title: "Transaction",
    url: "#",
    icon: BadgeDollarSign,
  },
  {
    title: "Chart",
    url: "#",
    icon: ChartPie,
  },
  {
    title: "Journal",
    url: "#",
    icon: NotepadText,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];
const balance = "512.200.000,00";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <img src={SpendlyLogo} className="logo w-40" alt="Spendly" />
      </SidebarHeader>
      <SidebarContent className="p-3">
        <SidebarGroup>
          <Select>
            <SelectTrigger className="w-full py-5 bg-primary text-white font-medium [&_svg]:!text-white [&_svg]:stroke-[3] [&_svg]:size-6 [&_svg]:opacity-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">
                <FontAwesomeIcon icon={faUser} size="xl" /> Personal Plan
              </SelectItem>
              <SelectItem value="shared">
                <FontAwesomeIcon icon={faUserGroup} size="xl" /> Shared Plan
              </SelectItem>
            </SelectContent>
          </Select>
        </SidebarGroup>
        <SidebarGroup>
          <p>Balance:</p>
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <h3 className="text-xl font-bold truncate">IDR {balance}</h3>
            </TooltipTrigger>
            <TooltipContent>
              <p>{balance}</p>
            </TooltipContent>
          </Tooltip>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem className="my-1" key={item.title}>
                  <SidebarMenuButton className="py-2" asChild>
                    <a href={item.url}>
                      <item.icon className="opacity-75" />
                      <p className="text-base opacity-75">{item.title}</p>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
