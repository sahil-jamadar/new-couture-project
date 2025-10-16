import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative h-9 w-9 p-0 rounded-full transition-all duration-300 
                hover:bg-primary/10 hover:scale-105 
                dark:hover:bg-accent/20"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Sun
        className={`h-[1.1rem] w-[1.1rem] transition-all duration-300 ${
          theme === 'light'
            ? 'rotate-0 scale-100 text-primary'
            : 'rotate-90 scale-0 text-transparent'
        }`}
      />
      <Moon
        className={`absolute h-[1.1rem] w-[1.1rem] transition-all duration-300 ${
          theme === 'dark'
            ? 'rotate-0 scale-100 text-accent'
            : '-rotate-90 scale-0 text-transparent'
        }`}
      />
    </Button>
  );
}