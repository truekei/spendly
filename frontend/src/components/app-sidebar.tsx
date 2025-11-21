import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@/contexts/UserContext";
import { formatCurrency } from "@/lib/utils";
import { faUser, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  BadgeDollarSign,
  Bell,
  ChartPie,
  Ellipsis,
  LayoutDashboard,
  LogOut,
  NotepadText,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DefaultAvatar from "/profile.png";
import SpendlyLogo from "/spendly_blacktext.svg";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Transaction",
    url: "/transaction",
    icon: BadgeDollarSign,
  },
  {
    title: "Chart",
    url: "/chart",
    icon: ChartPie,
  },
  {
    title: "Journal",
    url: "/journal",
    icon: NotepadText,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user) return null;

  return (
    <Sidebar className="shadow-sm">
      <SidebarHeader>
        <img src={SpendlyLogo} className="logo w-40" alt="Spendly" />
      </SidebarHeader>
      <SidebarContent className="p-3">
        <SidebarGroup>
          <Select defaultValue="personal">
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
              <h3 className="text-xl font-bold truncate">
                {formatCurrency(BigInt(user.balance), "id-ID", "IDR")}
              </h3>
            </TooltipTrigger>
            <TooltipContent>
              <p>{`Rp. ${formatCurrency(
                BigInt(user.balance),
                "id-ID",
                "IDR"
              )}`}</p>
            </TooltipContent>
          </Tooltip>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem className="my-1" key={item.title}>
                  <SidebarMenuButton
                    className="py-2 opacity-70 hover:opacity-100"
                    asChild
                  >
                    <a href={item.url}>
                      <item.icon />
                      <p className="text-base">{item.title}</p>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={DefaultAvatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <Ellipsis className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={15}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={DefaultAvatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={async () => {
                await axios.post(
                  "http://localhost:5000/api/auth/logout",
                  {},
                  { withCredentials: true }
                );
                navigate("/login");
              }}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
