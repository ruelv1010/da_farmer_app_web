"use client";

import { NavLink, useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem as UIAccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { ChevronDown, ChevronRight } from 'lucide-react';

type LinkType = {
  label: string;
  path: string;
  order: number;
};

type ListItem = {
  type: "list";
  value: string;
  order: number;
  defaultOpen: boolean;
  title?: string;
  links: LinkType[];
};

type AccordionItemType = {
  type: "accordion";
  title: string;
  value: string;
  order: number;
  defaultOpen: boolean;
  links: LinkType[];
};

type ParentItem = {
  type: "parent";
  title: string;
  value: string;
  order: number;
  defaultOpen: boolean;
  expandable?: boolean;
  children: AccordionItemType[];
};

type MenuItem = ListItem | AccordionItemType | ParentItem;

const menuItems: MenuItem[] = [
  {
    type: "list" as const,
    value: "dashboard",
    order: 1,
    defaultOpen: true,
    links: [{ label: "Dashboard", path: "/dashboard", order: 1 }],
  },
  {
    type: "accordion" as const,
    title: "Validation",
    value: "validation",
    order: 2,
    defaultOpen: false,
    links: [
      {
        label: "Cash Assistance",
        path: "/validation/cash-assistance",
        order: 1,
      },
      {
        label: "Subsidy",
        path: "/validation/subsidy",
        order: 2,
      },
    ],
  },
  {
    type: "list" as const,
    value: "farmers",
    order: 3,
    defaultOpen: true,
    links: [{ label: "Farmers", path: "/farmers", order: 1 }],
  },
    {
    type: "list" as const,
    value: "farmers-report",
    order: 3,
    defaultOpen: true,
    links: [{ label: "Farmers Report", path: "/farmers-report", order: 1 }],
  },
  {
    type: "accordion" as const,
    title: "Crops",
    value: "crops",
    order: 4,
    defaultOpen: false,
    links: [
      { label: "Crop List", path: "/crops-list", order: 1 },
      { label: "Crop Report", path: "/crops-reports", order: 1 },
    ],
  },
  {
    type: "accordion" as const,
    title: "Assistance",
    value: "assistance",
    order: 5,
    defaultOpen: false,
    links: [
      {
        label: "Assistance Beneficiary",
        path: "/assistance/beneficiary",
        order: 1,
      },
    ],
  },
  {
    type: "list" as const,
    value: "users",
    order: 6,
    defaultOpen: true,
    links: [{ label: "Users Management", path: "/users", order: 1 }],
  },
];

const menuConfig = {
  dashboard: {
    sectionTitle: "Dashboard",
    order: 1,
    pathPattern: /^\/dashboard/,
    items: menuItems,
  },
  validation: {
    sectionTitle: "Validation",
    order: 2,
    pathPattern: /^\/validation/,
    items: menuItems,
  },
  rsbsa: {
    sectionTitle: "RSBSA",
    order: 3,
    pathPattern: /^\/rsbsa/,
    items: menuItems,
  },
  farmersReports: {
    sectionTitle: "Farmers’ Reports",
    order: 4,
    pathPattern: /^\/farmers-reports/,
    items: menuItems,
  },
  insuranceReport: {
    sectionTitle: "Insurance Report",
    order: 5,
    pathPattern: /^\/insurance-report/,
    items: menuItems,
  },
  users: {
    sectionTitle: "Users Management",
    order: 6,
    pathPattern: /^\/users/,
    items: menuItems,
  },
  generateReports: {
    sectionTitle: "Generate Reports",
    order: 7,
    pathPattern: /^\/generate-reports/,
    items: menuItems,
  },
};


type MenuSection = keyof typeof menuConfig;

export default function ImprovedSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  // State to manage accordion open/close
  const [accordionValue, setAccordionValue] = useState<string>("");
  const [parentOpenStates, setParentOpenStates] = useState<Record<string, boolean>>({});

  const {
    sortedItems,
    defaultAccordionValue,
  } = useMemo(() => {
    // Determine which section to show based on current path
    let activeSection: MenuSection = "dashboard"; // default fallback

    for (const [sectionKey, section] of Object.entries(menuConfig)) {
      if (section.pathPattern.test(currentPath)) {
        activeSection = sectionKey as MenuSection;
        break;
      }
    }

    const section = menuConfig[activeSection];

    // Sort items by order
    const sortedItems = [...section.items].sort((a, b) => a.order - b.order);

    // Sort links within each item
    sortedItems.forEach((item) => {
      if (item.type === "list" || item.type === "accordion") {
        item.links.sort((a, b) => a.order - b.order);
      }
      if (item.type === "parent" && item.children) {
        item.children.forEach((child) => {
          child.links.sort((a, b) => a.order - b.order);
        });
      }
    });

    // Initialize parent states based on defaultOpen
    const initialParentStates: Record<string, boolean> = {};
    sortedItems.forEach((item) => {
      if (item.type === "parent") {
        initialParentStates[item.value] = item.defaultOpen;
      }
    });
    setParentOpenStates(prev => ({ ...initialParentStates, ...prev }));

    // Find default accordion value based on current path or defaultOpen
    let defaultAccordionValue = "";

    // First, check if current path matches any accordion item (including nested ones)
    for (const item of sortedItems) {
      if (item.type === "accordion") {
        const hasActiveLink = item.links.some(
          (link) =>
            currentPath === link.path || currentPath.startsWith(link.path + "/")
        );
        if (hasActiveLink) {
          defaultAccordionValue = item.value;
          break;
        }
      } else if (item.type === "parent" && item.children) {
        for (const child of item.children) {
          const hasActiveLink = child.links.some(
            (link) =>
              currentPath === link.path || currentPath.startsWith(link.path + "/")
          );
          if (hasActiveLink) {
            defaultAccordionValue = child.value;
            // Also open the parent if it's expandable
            if (item.expandable !== false) {
              setParentOpenStates(prev => ({ ...prev, [item.value]: true }));
            }
            break;
          }
        }
        if (defaultAccordionValue) break;
      }
    }

    // If no active link found, use the first defaultOpen accordion
    if (!defaultAccordionValue) {
      const defaultOpenItem = sortedItems.find(
        (item) => (item.type === "accordion" || item.type === "parent") && item.defaultOpen
      );
      defaultAccordionValue = defaultOpenItem?.value || "";
    }

    return {
      sortedItems,
      defaultAccordionValue,
    };
  }, [currentPath]);

  // Update accordion value when default changes
  useMemo(() => {
    setAccordionValue(defaultAccordionValue);
  }, [defaultAccordionValue]);

  const toggleParent = (parentValue: string) => {
    setParentOpenStates(prev => ({
      ...prev,
      [parentValue]: !prev[parentValue]
    }));
  };

  const renderMenuItem = (item: MenuItem, key: number) => {
    if (item.type === "list") {
      return (
        <div key={key} className="space-y-1 ">
          {
            item.title && (
              <>
                <div className="px-2 py-1">
                  <h3 className="text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider px-1.5">
                    {item.title}
                  </h3>
                </div>
              </>
            )
          }
          <div className="flex flex-col gap-1">
            {item.links.map((link, linkKey) => (
              <NavLink
                key={linkKey}
                to={link.path}
                className={({ isActive }) =>
                  clsx(
                    "text-sm rounded-md hover:bg-foreground hover:text-white px-3 py-2 font-medium transition-colors",
                    isActive
                      ? "bg-foreground text-white"
                      : "text-sidebar-foreground"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      );
    }

    if (item.type === "parent") {
      return (
        <div key={key} className="space-y-1">
          <div className="px-2 py-1">
            {item.expandable !== false ? (
              // Expandable parent (accordion-style)
              <button
                onClick={() => toggleParent(item.value)}
                className="flex items-center justify-between w-full text-left hover:text-sidebar-accent-foreground"
              >
                <h3 className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider px-1.5">
                  {item.title}
                </h3>
                {parentOpenStates[item.value] ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>
            ) : (
              // Static separator (non-expandable)
              <h3 className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider px-1.5">
                {item.title}
              </h3>
            )}
          </div>
          {(item.expandable === false || parentOpenStates[item.value]) && (
            <div className="ml-4">
              <Accordion
                type="single"
                collapsible
                className="w-full space-y-1"
                value={accordionValue}
                onValueChange={setAccordionValue}
              >
                {item.children.map((child, childKey) => (
                  <UIAccordionItem
                    key={childKey}
                    value={child.value}
                    className="border-none"
                  >
                    <AccordionTrigger className="px-3 py-2 rounded-md text-sm font-medium hover:underline">
                      {child.title}
                    </AccordionTrigger>
                    <AccordionContent className="pb-1">
                      <div className="flex flex-col gap-1 ml-3">
                        {child.links.map((link) => (
                          <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                              clsx(
                                "text-sm rounded-md hover:bg-foreground hover:text-white px-3 py-2 font-medium transition-colors",
                                isActive
                                  ? "bg-foreground "
                                  : "text-sidebar-foreground"
                              )
                            }
                          >
                            {link.label}
                          </NavLink>
                        ))}
                      </div>
                    </AccordionContent>
                  </UIAccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      );
    }

    if (item.type === "accordion") {
      return (
        <Accordion
          key={key}
          type="single"
          collapsible
          className="w-full space-y-1"
          value={accordionValue}
          onValueChange={setAccordionValue}
        >
          <UIAccordionItem
            value={item.value}
            className="border-none"
          >
            <AccordionTrigger className="px-3 py-2 rounded-md text-sm font-medium hover:underline">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="pb-1">
              <div className="flex flex-col gap-1 ml-3">
                {item.links.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      clsx(
                        "text-sm rounded-md hover:bg-foreground hover:text-white px-3 py-2 font-medium transition-colors",
                        isActive
                          ? "bg-foreground text-white"
                          : "text-sidebar-foreground"
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </AccordionContent>
          </UIAccordionItem>
        </Accordion>
      );
    }

    return null;
  };

  return (
    <aside className="w-64 h-full p-2 bg-sidebar border-r border-sidebar-border overflow-y-auto ">
      <nav className="flex flex-col gap-2">
        {/* Render all items in their sorted order */}
        {sortedItems.map((item, key) => renderMenuItem(item, key))}
      </nav>
    </aside>
  );
}