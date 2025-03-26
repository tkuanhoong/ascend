"use client";

import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

const NavBar = () => {
  const session = useSession();
  const router = useRouter();
  const user = session.data?.user;
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Purchased courses",
      href: "/courses",
    },
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Logout",
      href: "#",
      onClick: signOut,
    },
  ];

  const guestNavigationItems = [
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
    <header className="w-full sticky top-0 z-50 shadow">
      <div className="container px-4 flex h-16 items-center justify-between mx-auto">
        <div className="mr-4 flex items-center md:mr-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Ascend</span>
          </Link>
        </div>

        {/* desktop navbar */}
        <nav className="hidden md:flex gap-6 flex-wrap items-center justify-end">
          {user ? (
            <>
              {menuItems.map((item) =>
                item.label === "Dashboard" ? (
                  <Button
                    key={item.href}
                    onClick={() => router.push("/dashboard")}
                  >
                    Dashboard
                  </Button>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => item.onClick && item.onClick()}
                  >
                    {item.label}
                  </Link>
                )
              )}
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
                    menuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => item.onClick && item.onClick()}
                        className={cn(
                          "flex items-center py-2 text-base font-medium transition-colors hover:text-primary",
                          pathname === item.href
                            ? "text-slate-950 font-bold"
                            : "text-slate-600"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))
                  ) : (
                    <>
                      {guestNavigationItems.map((item) => (
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
