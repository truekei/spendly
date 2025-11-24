import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";

export function ToggleTheme() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Switch onCheckedChange={toggleTheme} defaultChecked={theme === "dark"} />
  );
}
