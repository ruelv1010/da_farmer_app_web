"use client"
import debounce from "lodash.debounce"
import type React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  FileIcon,
  FilterIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TableIcon,
  TrashIcon,
  XIcon,
  ChevronUpIcon,
} from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "../ui/label"
import { cn } from "@/lib/utils"
import DateCalendar from "../date-calendar/date-calendar"
import type { DateRange } from "react-day-picker"

export type SearchDefinition = {
  title: string
  placeholder: string
  enableSearch?: boolean
}

export type DisplayCondition<T> = {
  value: T
  label: string
  className?: string
}

export type ColumnDefinition<T> = {
  id: string
  header: string
  accessorKey: keyof T
  enableSorting?: boolean
  displayCondition?: DisplayCondition<any>[]
  align?: string
  cell?: (item: T) => React.ReactNode
}

export type GroupedColumnDefinition<T> = {
  id: string
  header: string
  columns: ColumnDefinition<T>[]
  className?: string
}

export type FilterDefinition = {
  id: string
  label: string
  type: "select" | "input" | "date" | "dateRange"
  options?: { label: string; value: string }[]
  placeholder?: string
}

export type ActionButton<T> = {
  label: string
  icon?: React.ReactNode
  onClick: (item: T) => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  className?: string
  showInHeader?: boolean
  position?: "start" | "end"
  requiresSelection?: boolean
}

export type BulkActionButton<T> = {
  label: string
  icon?: React.ReactNode
  onClick: (selectedItems: T[]) => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  className?: string
  disabled?: boolean
}

export type FooterRowDefinition<_T> = {
  id: string
  label: string
  className?: string
  columns: Record<
    string,
    {
      content?: string | number | React.ReactNode
      className?: string
      colSpan?: number
    }
  >
}

export type CustomFooterConfig<T> = {
  enabled: boolean
  rows: FooterRowDefinition<T>[]
}

export type DataTableProps<T> = {
  title: string
  subtitle?: string
  data: T[]
  columns: ColumnDefinition<T>[]
  filters?: FilterDefinition[]
  search?: SearchDefinition
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onNew?: () => void
  idField?: keyof T
  enableNew?: boolean
  newButtonText?: string
  enablePdfExport?: boolean
  enableCsvExport?: boolean
  enableFilter?: boolean
  enableSelection?: boolean
  onPdfExport?: () => void
  onCsvExport?: () => void
  onPaginationChange?: (page: number) => void
  onRowCountChange?: (rows: number) => void
  onSearchChange?: (search: string) => void
  onSelectionChange?: (selectedItems: T[]) => void
  onLoading?: boolean
  onResetTable?: boolean
  totalCount: number
  perPage: number
  pageNumber: number
  actionButtons?: ActionButton<T>[]
  bulkActionButtons?: BulkActionButton<T>[]
  selectedItems?: T[]
  onSort?: (column: string, sort: string) => void
  showTotals?: boolean
  calculateTotals?: (data: T[]) => Record<string, any>
  customFooter?: CustomFooterConfig<T>
  footerLabel?: string
  filterValues?: Record<string, any>
  enableRowNumbers?: boolean
  onFilterChange?: (filterId: string, value: any) => void
  groupedColumns?: GroupedColumnDefinition<T>[]
}

export function DataTableV2<T>({
  title,
  subtitle,
  data,
  columns,
  filters = [],
  search,
  onEdit,
  onDelete,
  onNew,
  idField = "id" as keyof T,
  enableNew = true,
  newButtonText = "New",
  enablePdfExport = true,
  enableCsvExport = true,
  enableFilter = true,
  enableSelection = false,
  onPdfExport,
  onCsvExport,
  onLoading = false,
  onResetTable = false,
  pageNumber,
  perPage,
  onPaginationChange,
  onRowCountChange,
  onSearchChange,
  onSelectionChange,
  actionButtons = [],
  bulkActionButtons = [],
  selectedItems: externalSelectedItems,
  onSort,
  showTotals = false,
  calculateTotals,
  customFooter,
  footerLabel = "GRAND TOTAL",
  filterValues: externalFilterValues,
  enableRowNumbers = false,
  onFilterChange: externalFilterChange,
  groupedColumns,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(pageNumber ?? 1)
  const [rowsPerPage, setRowsPerPage] = useState(perPage ?? 10)
  const [internalActiveFilters, setInternalActiveFilters] = useState<Record<string, any>>({})

  const activeFilters = externalFilterValues ?? internalActiveFilters
  const [internalSelectedItems, setInternalSelectedItems] = useState<T[]>([])

  const selectedItems = externalSelectedItems ?? internalSelectedItems
  const setSelectedItems = onSelectionChange ?? setInternalSelectedItems

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        if (onSearchChange) {
          onSearchChange(value)
        }
      }, 500),
    [onSearchChange],
  )

  useEffect(() => {
    debouncedSearch(searchQuery)
    return () => debouncedSearch.cancel()
  }, [searchQuery, debouncedSearch])

  useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange(currentPage)
    }
  }, [currentPage, onPaginationChange])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, activeFilters])

  useEffect(() => {
    if (onResetTable) {
      if (currentPage != 0) {
        setCurrentPage(currentPage - 1)
      } else {
        setCurrentPage(1)
      }
    }
  }, [currentPage, onResetTable])

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      onSort?.(columnId, sortDirection === "asc" ? "desc" : "asc")
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(columnId)
      onSort?.(columnId, "asc")
      setSortDirection("asc")
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems([...data])
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (item: T, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, item])
    } else {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem[idField] !== item[idField]))
    }
  }

  const isItemSelected = (item: T) => {
    return selectedItems.some((selectedItem) => selectedItem[idField] === item[idField])
  }

  const isAllSelected = data.length > 0 && selectedItems.length === data.length
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < data.length

  const filteredBySearch = data.filter((item) => {
    if (!searchQuery) return true

    return columns.some((column) => {
      const value = item[column.accessorKey]
      if (value === null || value === undefined) return false
      return String(value).toLowerCase().includes(searchQuery.toLowerCase())
    })
  })

  const filteredData = filteredBySearch.filter((item) => {
    if (Object.keys(activeFilters).length === 0) return true

    return Object.entries(activeFilters).every(([filterId, filterValue]) => {
      if (!filterValue || filterValue === "" || filterValue === "all") return true

      const filter = filters.find((f) => f.id === filterId)
      if (!filter) return true

      const column = columns.find((col) => String(col.accessorKey) === filterId)
      if (!column) {
        console.warn(`No column found for filter ${filterId}`)
        return true
      }

      const itemValue = item[column.accessorKey]

      switch (filter.type) {
        case "select":
          return String(itemValue) === String(filterValue)

        case "input":
          if (itemValue === null || itemValue === undefined) return false
          return String(itemValue).toLowerCase().includes(String(filterValue).toLowerCase())

        case "date":
          if (!filterValue || !itemValue) return true
          try {
            const itemDate = new Date(itemValue as string)
            const filterDate = new Date(filterValue)

            if (isNaN(itemDate.getTime()) || isNaN(filterDate.getTime())) return false

            itemDate.setHours(0, 0, 0, 0)
            filterDate.setHours(0, 0, 0, 0)

            return itemDate.getTime() === filterDate.getTime()
          } catch (error) {
            console.error("Error comparing dates:", error)
            return false
          }

        case "dateRange":
          if (!filterValue || !itemValue) return true
          try {
            const itemDate = new Date(itemValue as string)

            if (filterValue.from) {
              const fromDate = new Date(filterValue.from)
              if (isNaN(fromDate.getTime())) return false
              fromDate.setHours(0, 0, 0, 0)

              if (itemDate < fromDate) return false
            }

            if (filterValue.to) {
              const toDate = new Date(filterValue.to)
              if (isNaN(toDate.getTime())) return false
              toDate.setHours(23, 59, 59, 999)

              return itemDate <= toDate
            }

            return true
          } catch (error) {
            console.error("Error comparing date ranges:", error)
            return false
          }

        default:
          return true
      }
    })
  })

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  const handleFilterChange = (filterId: string, value: any) => {
    if (externalFilterChange) {
      externalFilterChange(filterId, value)
    } else {
      setInternalActiveFilters((prev) => ({
        ...prev,
        [filterId]: value,
      }))
    }
  }

  const resetFilters = () => {
    if (externalFilterChange) {
      filters.forEach((filter) => {
        externalFilterChange(filter.id, "")
      })
    } else {
      setInternalActiveFilters({})
    }
    setSearchQuery("")
    setCurrentPage(1)
    if (enableSelection) {
      setSelectedItems([])
    }
  }

  const handlePdfExport = () => {
    if (onPdfExport) {
      onPdfExport()
    } else {
      console.log("Export to PDF", filteredData)
    }
  }

  const handleCsvExport = () => {
    if (onCsvExport) {
      onCsvExport()
    } else {
      console.log("Export to CSV", filteredData)
    }
  }

  const validFilters = Object.entries(activeFilters).filter(([filterId, value]) => {
    const filter = filters.find((f) => f.id === filterId)
    return filter && value && value !== "" && value !== "all"
  })

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {actionButtons
            ?.filter((btn) => btn.showInHeader)
            ?.map((button, index) => (
              <Button
                key={`header-action-${index}`}
                variant={button.variant || "outline"}
                size="sm"
                onClick={() => button.onClick(data[0])}
                className={button.className}
              >
                {button.icon && <span>{button.icon}</span>}
                {button.label}
              </Button>
            ))}
          {enablePdfExport && (
            <Button variant="outline" size="sm" onClick={handlePdfExport}>
              <FileIcon className="h-4 w-4" />
              PDF
            </Button>
          )}
          {enableCsvExport && (
            <Button variant="outline" size="sm" onClick={handleCsvExport}>
              <TableIcon className="h-4 w-4" />
              CSV
            </Button>
          )}
          {enableNew && (
            <Button size="sm" onClick={onNew}>
              <PlusIcon className="h-4 w-4" />
              {newButtonText}
            </Button>
          )}
        </div>
      </div>

      {/* Selection Summary and Bulk Actions */}
      {enableSelection && (
        <div className="flex items-center justify-end">
          {selectedItems.length > 0 && bulkActionButtons.length > 0 && (
            <div className="flex items-center gap-2">
              {bulkActionButtons.map((button, index) => (
                <Button
                  key={`bulk-action-${index}`}
                  variant={button.variant || "outline"}
                  size="sm"
                  onClick={() => button.onClick(selectedItems)}
                  disabled={button.disabled || selectedItems.length === 0}
                  className={button.className}
                >
                  {button.icon && <span className="mr-2">{button.icon}</span>}
                  {button.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search and Filters */}
      <div className="space-y-4">
        <div>
          <div className="flex gap-2">
            <div className="flex gap-2 flex-1">
              {search?.enableSearch && (
                <div className="flex flex-col">
                  <p className="mb-2 text-sm">{search?.title}</p>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder={search?.placeholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-[300px]"
                    />
                  </div>
                </div>
              )}

              {enableFilter &&
                filters.map((filter) => (
                  <div key={filter.id} className="space-y-2">
                    <Label className="text-sm font-medium">{filter.label}</Label>
                    {filter.type === "select" && (
                      <Select
                        value={activeFilters[filter.id] || "all"}
                        onValueChange={(value) => handleFilterChange(filter.id, value === "all" ? "" : value)}
                      >
                        <SelectTrigger id={filter.id} className="w-full">
                          <SelectValue placeholder={filter.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          {filter.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {filter.type === "input" && (
                      <Input
                        id={filter.id}
                        value={activeFilters[filter.id] || ""}
                        onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                        placeholder={filter.placeholder || `Enter ${filter.label}`}
                        className="w-full"
                      />
                    )}

                    {filter.type === "date" && (
                      <DateCalendar
                        mode="single"
                        date={activeFilters[filter.id] ? new Date(activeFilters[filter.id]) : undefined}
                        setDate={(date) => handleFilterChange(filter.id, date)}
                        placeholder={filter.placeholder || "Select date"}
                        className="w-full"
                      />
                    )}

                    {filter.type === "dateRange" && (
                      <DateCalendar
                        mode="range"
                        range={activeFilters[filter.id] as DateRange}
                        setRange={(range) => handleFilterChange(filter.id, range)}
                        placeholder={filter.placeholder || "Select date range"}
                        className="w-full"
                      />
                    )}
                  </div>
                ))}
            </div>
            {enableFilter && (
              <div className="flex gap-2 items-end">
                <Button variant="outline" size="default" className="cursor-pointer">
                  <FilterIcon className="h-4 w-4" />
                  <span className="">Filter</span>
                </Button>
                <Button variant="outline" size="default" onClick={resetFilters} className="cursor-pointer">
                  <XIcon className="h-4 w-4" />
                  <span className="">Reset</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {validFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {validFilters.map(([filterId, value]) => {
            const filter = filters.find((f) => f.id === filterId)!
            let displayValue = ""

            if (filter.type === "select") {
              const option = filter.options?.find((opt) => opt.value === value)
              displayValue = option?.label || String(value)
            } else if (filter.type === "date" && value) {
              try {
                displayValue = new Date(value).toLocaleDateString()
              } catch {
                displayValue = String(value)
              }
            } else if (filter.type === "dateRange" && value?.from) {
              try {
                if (value.to) {
                  displayValue = `${new Date(value.from).toLocaleDateString()} - ${new Date(value.to).toLocaleDateString()}`
                } else {
                  displayValue = `From ${new Date(value.from).toLocaleDateString()}`
                }
              } catch {
                displayValue = "Invalid date range"
              }
            } else {
              displayValue = String(value)
            }

            return (
              <div key={filterId} className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-sm">
                <span>
                  {filter.label}: {displayValue}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4"
                  onClick={() => {
                    handleFilterChange(filterId, "")
                  }}
                >
                  <XIcon className="h-3 w-3" />
                  <span className="sr-only">Remove filter</span>
                </Button>
              </div>
            )
          })}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {groupedColumns && groupedColumns.length > 0 ? (
              <>
                {/* First row - Group headers */}
                <TableRow>
                  {enableRowNumbers && <TableHead className="w-[60px] text-center">No.</TableHead>}
                  {enableSelection && <TableHead className="w-[50px]"></TableHead>}
                  {groupedColumns.map((group) => (
                    <TableHead
                      key={group.id}
                      colSpan={group.columns.length}
                      className={cn("text-center border-b-0", group.className)}
                    >
                      {group.header}
                    </TableHead>
                  ))}
                  {(onEdit || onDelete || actionButtons?.length > 0) && <TableHead className="w-[100px]"></TableHead>}
                </TableRow>
                {/* Second row - Individual column headers */}
                <TableRow>
                  {enableRowNumbers && <TableHead className="w-[60px] text-center">No.</TableHead>}
                  {enableSelection && (
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={isAllSelected}
                        ref={(el) => {
                          if (el) {
                            const checkbox = el.querySelector('input[type="checkbox"]') as HTMLInputElement
                            if (checkbox) {
                              checkbox.indeterminate = isIndeterminate
                            }
                          }
                        }}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                  )}
                  {groupedColumns.flatMap((group) =>
                    group.columns.map((column) => (
                      <TableHead
                        key={column.id}
                        className={cn(
                          column.enableSorting === false ? "" : "cursor-pointer",
                          column.align === "right" ? "text-right" : "",
                        )}
                      >
                        <div
                          className="flex items-center"
                          onClick={() => column.enableSorting !== false && handleSort(column.id)}
                        >
                          {column.header}
                          {column.enableSorting !== false && (
                            <>
                              {sortColumn === column.id ? (
                                sortDirection === "asc" ? (
                                  <ChevronUpIcon className="ml-2 h-4 w-4" />
                                ) : (
                                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                                )
                              ) : (
                                <ChevronsUpDownIcon className="ml-2 h-4 w-4 opacity-50" />
                              )}
                            </>
                          )}
                        </div>
                      </TableHead>
                    )),
                  )}
                  {(onEdit || onDelete || actionButtons?.length > 0) && (
                    <TableHead className="w-[100px] text-right"></TableHead>
                  )}
                </TableRow>
              </>
            ) : (
              // Original single row header for backward compatibility
              <TableRow>
                {enableRowNumbers && <TableHead className="w-[60px] text-center">No.</TableHead>}
                {enableSelection && (
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) {
                          const checkbox = el.querySelector('input[type="checkbox"]') as HTMLInputElement
                          if (checkbox) {
                            checkbox.indeterminate = isIndeterminate
                          }
                        }
                      }}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                {columns.map((column) => (
                  <TableHead
                    key={column.id}
                    className={cn(
                      column.enableSorting === false ? "" : "cursor-pointer",
                      column.align === "right" ? "text-right" : "",
                    )}
                  >
                    <div
                      className="flex items-center"
                      onClick={() => column.enableSorting !== false && handleSort(column.id)}
                    >
                      {column.header}
                      {column.enableSorting !== false && (
                        <>
                          {sortColumn === column.id ? (
                            sortDirection === "asc" ? (
                              <ChevronUpIcon className="ml-2 h-4 w-4" />
                            ) : (
                              <ChevronDownIcon className="ml-2 h-4 w-4" />
                            )
                          ) : (
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 opacity-50" />
                          )}
                        </>
                      )}
                    </div>
                  </TableHead>
                ))}
                {(onEdit || onDelete || actionButtons?.length > 0) && (
                  <TableHead className="w-[100px] text-right"></TableHead>
                )}
              </TableRow>
            )}
          </TableHeader>
          <TableBody>
            {onLoading ? (
              <TableRow>
                <TableCell
                  colSpan={
                    (groupedColumns ? groupedColumns.flatMap((group) => group.columns).length : columns.length) +
                    (enableRowNumbers ? 1 : 0) +
                    (enableSelection ? 1 : 0) +
                    (onEdit || onDelete || actionButtons?.length > 0 ? 1 : 0)
                  }
                  className="text-center py-4"
                >
                  Loading Data...
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    (groupedColumns ? groupedColumns.flatMap((group) => group.columns).length : columns.length) +
                    (enableRowNumbers ? 1 : 0) +
                    (enableSelection ? 1 : 0) +
                    (onEdit || onDelete || actionButtons?.length > 0 ? 1 : 0)
                  }
                  className="text-center py-4"
                >
                  No data found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow key={String(item[idField])}>
                  {enableRowNumbers && (
                    <TableCell className="text-center font-medium">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </TableCell>
                  )}
                  {enableSelection && (
                    <TableCell>
                      <Checkbox
                        checked={isItemSelected(item)}
                        onCheckedChange={(checked) => handleSelectItem(item, checked as boolean)}
                      />
                    </TableCell>
                  )}
                  {(groupedColumns ? groupedColumns.flatMap((group) => group.columns) : columns).map((column) => (
                    <TableCell
                      key={`${String(item[idField])}-${column.id}`}
                      className={`p-4 ${column.align === "right" ? "text-right" : "left"}`}
                    >
                      {(() => {
                        const value = item[column.accessorKey]

                        const match = column.displayCondition?.find((condition) => condition.value === value)

                        const label = match?.label ?? String(value ?? "")
                        const className = match?.className

                        const content = column.cell ? column.cell(item) : label

                        return className ? <span className={className}>{content}</span> : content
                      })()}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete || actionButtons?.length > 0) && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {actionButtons
                          ?.filter((btn) => !btn.showInHeader)
                          ?.map((button, index) => (
                            <Button
                              key={`row-action-${index}`}
                              variant={button.variant || "ghost"}
                              size="icon"
                              onClick={() => button.onClick(item)}
                              className={button.className}
                            >
                              {button.icon || <span className="text-xs">{button.label.charAt(0)}</span>}
                              <span className="sr-only">{button.label}</span>
                            </Button>
                          ))}
                        {onEdit && (
                          <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                            <PencilIcon className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        )}
                        {onDelete && (
                          <Button variant="ghost" size="icon" onClick={() => onDelete(item)}>
                            <TrashIcon className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
            {/* Custom Footer Rows */}
            {customFooter?.enabled && customFooter.rows.length > 0 && paginatedData.length > 0 && (
              <>
                {customFooter.rows.map((footerRow, rowIndex) => (
                  <TableRow
                    key={`footer-row-${rowIndex}`}
                    className={`hover:bg-unset bg-gray-200 ${footerRow.className || ""}`}
                  >
                    <TableCell
                      colSpan={(enableRowNumbers ? 1 : 0) + (enableSelection ? 1 : 0) + 1}
                      className="font-bold border-0 pl-4 px-4 py-6"
                    >
                      {footerRow.label}
                    </TableCell>
                    {(groupedColumns ? groupedColumns.flatMap((group) => group.columns) : columns)
                      .slice(1)
                      .map((column, _columnIndex) => {
                        const footerColumn = footerRow.columns[column.id]
                        const colSpan = footerColumn?.colSpan || 1

                        if (footerColumn && colSpan > 1) {
                          // Handle colspan - only render this cell, skip the next ones
                          return (
                            <TableCell
                              key={`footer-${footerRow.id}-${column.id}`}
                              className={`border-0 text-left font-medium p-4 ${footerColumn.className || ""}`}
                              colSpan={colSpan}
                            >
                              {footerColumn.content !== undefined ? footerColumn.content : "-"}
                            </TableCell>
                          )
                        } else if (!footerColumn || footerColumn.colSpan === undefined) {
                          // Normal cell
                          return (
                            <TableCell
                              key={`footer-${footerRow.id}-${column.id}`}
                              className={`border-0 text-left font-medium p-4 ${footerColumn?.className || ""}`}
                            >
                              {footerColumn?.content !== undefined ? footerColumn.content : "-"}
                            </TableCell>
                          )
                        }
                        return null // Skip cells that are part of a colspan
                      })}
                    {(onEdit || onDelete || actionButtons?.length > 0) && <TableCell className="border-0"></TableCell>}
                  </TableRow>
                ))}
              </>
            )}

            {/* Legacy Totals Row (for backward compatibility) */}
            {showTotals && !customFooter?.enabled && paginatedData.length > 0 && (
              <TableRow className="hover:bg-unset bg-gray-200">
                <TableCell
                  colSpan={(enableRowNumbers ? 1 : 0) + (enableSelection ? 1 : 0) + 1}
                  className="font-bold border-0 pl-4 px-4 py-6"
                >
                  {footerLabel}
                </TableCell>
                {(groupedColumns ? groupedColumns.flatMap((group) => group.columns) : columns)
                  .slice(enableSelection ? 1 : 1)
                  .map((column, _index) => {
                    const totals = calculateTotals ? calculateTotals(data) : {}
                    const totalValue = totals[column.id]

                    return (
                      <TableCell key={`total-${column.id}`} className="border-0 text-left font-medium p-4">
                        {totalValue !== undefined ? totalValue : "-"}
                      </TableCell>
                    )
                  })}
                {(onEdit || onDelete || actionButtons?.length > 0) && <TableCell className="border-0"></TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!onLoading && (
        <div className="flex items-center justify-end gap-6">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Rows per page</p>
            <Select
              value={String(rowsPerPage)}
              onValueChange={(value) => {
                setRowsPerPage(Number(value))
                setCurrentPage(1)
                if (onRowCountChange) {
                  onRowCountChange(Number(value))
                }
              }}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder={rowsPerPage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <p className="text-muted-foreground">
              Page {currentPage} of {totalPages || 1}
            </p>
            <div className="flex items-center gap-1 ml-4">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeftIcon className="h-4 w-4" />
                <span className="sr-only">First page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRightIcon className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronsRightIcon className="h-4 w-4" />
                <span className="sr-only">Last page</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

