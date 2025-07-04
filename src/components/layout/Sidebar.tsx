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
  expandable?: boolean; // Optional: if true, parent can be expanded/collapsed. If false/undefined, it's just a separator
  children: AccordionItemType[];
};

type MenuItem = ListItem | AccordionItemType | ParentItem;

const lendingItems: MenuItem[] = [
  {
    type: "list" as const,
    value: "loan-processing",
    order: 1,
    defaultOpen: true,
    links: [
      { label: "Salary Loan Processing", path: "/lending/salary-loan-processing", order: 1 },
      { label: "Cash Advance Processing", path: "/lending/cash-advance-processing", order: 2 },
      { label: "Bonus Loan Processing", path: "/lending/bonus-loan-processing", order: 3 },
      { label: "Loan Renewal", path: "/lending/loan-renewal", order: 4 },
    ],
  },
  {
    type: "accordion" as const,
    title: "Releasing",
    value: "releasing",
    order: 2,
    defaultOpen: true,
    links: [
      { label: "Check Encashment", path: "/lending/releasing/check-encashment", order: 1 },
      { label: "Change Voucher", path: "/lending/releasing/change-voucher", order: 2 },
      { label: "Salary and Cash Advance Payment", path: "/lending/releasing/salary-and-cash-advance-payment", order: 3 },
      { label: "Bonus Loan Payment", path: "/lending/releasing/bonus-loan-payment", order: 4 },
      { label: "Loans Payoff", path: "/lending/releasing/loans-payoff", order: 5 },
    ],
  },
  {
    type: "accordion" as const,
    title: "Borrowers",
    value: "borrowers",
    order: 3,
    defaultOpen: false,
    links: [
      { label: "Borrower's Master List", path: "/lending/borrowers/borrower-master-list", order: 1 },
      { label: "Pre-Loan Application", path: "/lending/borrowers/pre-loan-application", order: 2 },
    ],
  },
  {
    type: "accordion" as const,
    title: "Other Lending Transactions",
    value: "other-lending-transactions",
    order: 4,
    defaultOpen: false,
    links: [
      { label: "Card Custody Log", path: "/lending/card-custody-log", order: 1 },
      { label: "Unsold/No Account Recording", path: "/lending/unsold-or-no-account-recording", order: 2 },
    ],
  },
  {
    type: "parent" as const,
    title: "Reports",
    value: "reports",
    order: 5,
    defaultOpen: true,
    expandable: false, // This parent can be expanded/collapsed
    children: [
      {
        type: "accordion" as const,
        title: "Lending Reports",
        value: "lending-reports",
        order: 1,
        defaultOpen: false,
        links: [
          { label: "ATM Monitoring", path: "/lending/reports/atm-monitoring", order: 1 },
          { label: "UMID Monitoring", path: "/lending/reports/umid-monitoring", order: 2 },
          { label: "Cards Monitoring", path: "/lending/reports/cards-monitoring", order: 3 },
          { label: "Salary Loan Releases", path: "/lending/reports/salary-loan-release", order: 4 },
          { label: "Bonus Releases", path: "/lending/reports/bonus-releases", order: 5 },
          { label: "Bonus Summary Reports", path: "/lending/reports/bonus-summary-reports", order: 6 },
          { label: "Cash Advance Releases", path: "/lending/reports/cash-advance-releases", order: 7 },
          { label: "Unprocessed Loans", path: "/lending/reports/unprocessed-loans", order: 8 },
          { label: "Loans Qualified for Restructuring/Renewal", path: "/lending/reports/loans-qualified-for-restructuring", order: 9 },
          { label: "Borrower's Statement of Account and Ledger", path: "/lending/reports/borrowers-statement-of-account-and-ledger", order: 10 },
        ],
      },
      {
        type: "accordion" as const,
        title: "Collection Reports",
        value: "collection-reports",
        order: 2,
        defaultOpen: false,
        links: [
          { label: "Salary Loan and CA Collection Report", path: "/lending/reports/salary-loan-ca-collection-report", order: 1 },
          { label: "Bonus Loan Collection Report", path: "/lending/reports/bonus-loan-collection-report", order: 2 },
          { label: "Bonus Overdraft Report", path: "/lending/reports/bonus-overdraft-report", order: 3 },
          { label: "Total Overdraft", path: "/lending/reports/total-overdraft", order: 4 },
          { label: "Unclaimed Change Report", path: "/lending/reports/unclaimed-change-report", order: 5 },
          { label: "Loans Paid Off Summary", path: "/lending/reports/loans-paid-off-summary", order: 6 },
        ],
      },
      {
        type: "accordion" as const,
        title: "Accounting Reports",
        value: "accounting-reports",
        order: 3,
        defaultOpen: false,
        links: [
          { label: "Daily Check Encashment Summary", path: "/accounting/reports/daily-check-encashment-summary", order: 1 },
          { label: "Check Register Summary", path: "/accounting/reports/check-register-summary", order: 2 },
          { label: "Outstanding Check for Loans", path: "/accounting/reports/outstanding-check-for-loan", order: 3 },
          { label: "Deposit in Transit Report", path: "/accounting/reports/deposit-in-transit-report", order: 4 },
          { label: "Aging of Accounts", path: "/accounting/reports/aging-of-accounts", order: 5 },
        ],
      },
      {
        type: "accordion" as const,
        title: "Other Reports",
        value: "other-reports",
        order: 4,
        defaultOpen: false,
        links: [
          { label: "Unsold/No Accounts Summary", path: "/accounting/reports/unsold-or-no-account-summary", order: 1 },
          { label: "Clients Aged 53 and Above", path: "/accounting/reports/clients-age", order: 2 },
        ],
      },
    ],
  },
];

const sharedLendingItems = lendingItems.filter(item => item.value !== "reports");
const sharedReportsItems = lendingItems.filter(item => item.value === "reports");

const menuConfig = {
  dashboard: {
    sectionTitle: "Dashboard",
    order: 1,
    pathPattern: /^\/dashboard/,
    items: sharedLendingItems,
  },
  "borrower-dashboard": {
    sectionTitle: "Borrowers Dashboard",
    order: 2,
    pathPattern: /^\/borrower-dashboard/,
    items: sharedLendingItems,
  },

  lending: {
    sectionTitle: "Lending",
    order: 3,
    pathPattern: /^\/lending/,
    items: lendingItems,
  },

  accounting: {
    sectionTitle: "Accounting",
    order: 4,
    pathPattern: /^\/accounting/,
    items: sharedReportsItems,
  },

  maintenance: {
    sectionTitle: "Maintenance & Security",
    order: 5,
    pathPattern: /^\/maintenance-and-security/,
    items: [
      {
        type: "accordion" as const,
        title: "General Setup",
        value: "general-setup",
        order: 1,
        defaultOpen: true,
        links: [
          {
            label: "Branch Setup",
            path: "/maintenance-and-security/general-setup/branch-setup",
            order: 1,
          },
          {
            label: "Department Setup",
            path: "/maintenance-and-security/general-setup/department-setup",
            order: 2,
          },
        ],
      },
      {
        type: "accordion" as const,
        title: "Security",
        value: "security",
        order: 2,
        defaultOpen: false,
        links: [
          {
            label: "User Management",
            path: "/maintenance-and-security/security/user-management",
            order: 1,
          },
          {
            label: "User Permissions",
            path: "/maintenance-and-security/security/user-permissions",
            order: 2,
          },
        ],
      },
      {
        type: "accordion" as const,
        title: "Admin",
        value: "admin",
        order: 3,
        defaultOpen: false,
        links: [
          {
            label: "For approval list",
            path: "/maintenance-and-security/admin/approval",
            order: 1,
          },
          {
            label: "Back up and Restore",
            path: "/maintenance-and-security/admin/backup-and-restore",
            order: 2,
          },
          {
            label: "Activity Logs",
            path: "/maintenance-and-security/admin/activity-logs",
            order: 3,
          },
        ],
      },
      {
        type: "accordion" as const,
        title: "Accounting Setup",
        value: "accounting-setup",
        order: 4,
        defaultOpen: false,
        links: [
          {
            label: "Reference Settings",
            path: "/maintenance-and-security/accounting-setup/reference-settings",
            order: 1,
          },
          {
            label: "Chart of Accounts (CoA)",
            path: "/maintenance-and-security/accounting-setup/chart-of-accounts",
            order: 2,
          },
          {
            label: "Accounting Entries Defaults",
            path: "/maintenance-and-security/accounting-setup/accounting-entries-defaults",
            order: 3,
          },
          {
            label: "Default Account Setup",
            path: "/maintenance-and-security/accounting-setup/default-account-setup",
            order: 4,
          },
          {
            label: "Bank Account Setup",
            path: "/maintenance-and-security/accounting-setup/bank-account-setup",
            order: 5,
          },
          {
            label: "Cashiering",
            path: "/maintenance-and-security/accounting-setup/cashiering",
            order: 6,
          },
          {
            label: "General Journal",
            path: "/maintenance-and-security/accounting-setup/general-journal",
            order: 7,
          },
        ],
      },
      {
        type: "accordion" as const,
        title: "Lending Setup",
        value: "lending-setup",
        order: 5,
        defaultOpen: false,
        links: [
          {
            label: "Group Setup",
            path: "/maintenance-and-security/lending-setup/group-setup",
            order: 1,
          },
          {
            label: "Classification Setup",
            path: "/maintenance-and-security/lending-setup/classification-setup",
            order: 2,
          },
          {
            label: "Division Setup",
            path: "/maintenance-and-security/lending-setup/division-setup",
            order: 3,
          },
          {
            label: "District Setup",
            path: "/maintenance-and-security/lending-setup/district-setup",
            order: 4,
          },
          {
            label: "School / Office Setup",
            path: "/maintenance-and-security/lending-setup/school-office-setup",
            order: 5,
          },
          {
            label: "Salary Loan Setup",
            path: "/maintenance-and-security/lending-setup/salary-loan-setup",
            order: 6,
          },
          {
            label: "Bonus Loan Setup",
            path: "/maintenance-and-security/lending-setup/bonus-loan-setup",
            order: 7,
          },
          {
            label: "Cash Advance Setup",
            path: "/maintenance-and-security/lending-setup/ca-setup",
            order: 8,
          },
        ],
      },
    ],
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
        <div key={key} className="space-y-1">
          {
            item.title && (
              <>
                <div className="px-2 py-1">
                  <h3 className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider px-1.5">
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
    <aside className="w-64 h-full p-2 bg-sidebar border-r border-sidebar-border overflow-y-auto">
      <nav className="flex flex-col gap-2">
        {/* Render all items in their sorted order */}
        {sortedItems.map((item, key) => renderMenuItem(item, key))}
      </nav>
    </aside>
  );
}