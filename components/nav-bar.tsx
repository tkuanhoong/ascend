"use client";

import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import SearchBar from "./search-bar";
import UserMenu from "./user-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useCurrentRole } from "@/hooks/use-current-role";

type NavigationLink = {
  label: string;
  href: string;
  onClick?: () => void;
};

const NavBar = () => {
  const user = useCurrentUser();
  const { isAdmin } = useCurrentRole();
  const pathname = usePathname();
  const dashboardNavigationLink = isAdmin
    ? {
        label: "Admin Dashboard",
        href: "/admin/analytics",
      }
    : {
        label: "Dashboard",
        href: "/creator/analytics",
      };

  const profileMenuItems: NavigationLink[] = [
    {
      label: "Purchased courses",
      href: "/purchased-courses",
    },
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Logout",
      href: "#",
      onClick: () => signOut(),
    },
  ];

  const mobileMenuItems: NavigationLink[] = [
    {
      label: "Home",
      href: "/",
    },
    dashboardNavigationLink,
    ...profileMenuItems,
  ];

  const guestNavigationItems: NavigationLink[] = [
    {
      label: "Login",
      href: "/auth/login",
    },
    {
      label: "Register",
      href: "/auth/register",
    },
  ];

  return (
    <header className="w-full sticky top-0 z-50 shadow dark:bg-slate-900 bg-white">
      <div className="px-8 flex h-16 items-center justify-between mx-auto">
        <div className="mr-4 flex items-center md:mr-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Ascend</span>
          </Link>
        </div>

        {pathname === "/" && (
          <div className="hidden md:block">
            <SearchBar />
          </div>
        )}

        {/* desktop navbar */}
        <nav className="hidden md:flex gap-6 flex-wrap items-center justify-end">
          {user ? (
            <>
              <Button asChild>
                <Link href={dashboardNavigationLink.href}>
                  {dashboardNavigationLink.label}
                </Link>
              </Button>
              <UserMenu menuItems={profileMenuItems} />
            </>
          ) : (
            <>
              {guestNavigationItems.map((item) => (
                <Button
                  asChild
                  key={item.href}
                  variant={item.href === "/auth/login" ? "default" : "outline"}
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
            </>
          )}
        </nav>

        {/* mobile navbar */}
        <nav className="md:hidden flex gap-6 flex-wrap items-center justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetTitle>Menu</SheetTitle>
              <div className="grid gap-6 py-6">
                <div className="grid gap-3">
                  {user ? (
                    mobileMenuItems.map((item) => (
                      <SheetClose asChild key={item.href}>
                        <Link
                          onClick={item.onClick}
                          href={item.href}
                          className={cn(
                            "flex items-center py-2 text-base font-medium transition-colors hover:text-primary",
                            pathname === item.href
                              ? "text-slate-950 font-bold"
                              : "text-slate-600"
                          )}
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))
                  ) : (
                    <>
                      {guestNavigationItems.map((item) => (
                        <SheetClose asChild key={item.href}>
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "flex items-center py-2 text-base font-medium transition-colors hover:text-primary",
                              pathname === item.href
                                ? "text-slate-950 font-bold"
                                : "text-slate-600"
                            )}
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
