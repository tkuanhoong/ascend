"use client";
import { Slash } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

type RedirectableRoutes = {
  label: string;
  href: string;
};

interface CustomBreadcrumbProps {
  currentPageLabel: string;
  redirectableRoutes?: RedirectableRoutes[];
}

export function CustomBreadcrumb({
  redirectableRoutes,
  currentPageLabel,
}: CustomBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {redirectableRoutes &&
          redirectableRoutes.map((route, index) => (
            <Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink href={route.href}>{route.label}</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
            </Fragment>
          ))}
        <BreadcrumbItem>
          <BreadcrumbPage>{currentPageLabel}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
