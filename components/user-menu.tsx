import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface UserMenuProps {
  menuItems: {
    label: string;
    href: string;
    onClick?: () => void;
  }[];
}

const UserMenu = ({ menuItems }: UserMenuProps) => {
  const session = useSession();
  if (!session.data) {
    return (
      <>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/auth/login">
            <User className="mr-2 h-4 w-4" />
            Login
          </Link>
        </Button>
        <Button className="w-full justify-start" asChild>
          <Link href="/auth/register">Sign Up</Link>
        </Button>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="h-1 w-1" />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="m-0">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuItems.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href} onClick={item.onClick}>
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
