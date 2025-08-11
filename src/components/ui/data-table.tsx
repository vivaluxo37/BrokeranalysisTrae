import * as React from 'react'
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './table'
import { Input } from './input'
import { Button } from './button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'

// Column Definition Types
export interface ColumnDef<T> {
  id: string
  header: string | React.ReactNode
  accessorKey?: keyof T
  cell?: (props: { row: T; value: any }) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  width?: string | number
  align?: 'left' | 'center' | 'right'
}

export interface SortingState {
  id: string
  desc: boolean
}

export interface FilterState {
  id: string
  value: string
}

export interface PaginationState {
  pageIndex: number
  pageSize: number
}

// DataTable Props
export interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  loading?: boolean
  sorting?: boolean
  filtering?: boolean
  pagination?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  onRowClick?: (row: T) => void
}

// Sorting Hook
function useSorting<T>(data: T[], columns: ColumnDef<T>[]) {
  const [sorting, setSorting] = React.useState<SortingState[]>([])

  const sortedData = React.useMemo(() => {
    if (sorting.length === 0) return data

    return [...data].sort((a, b) => {
      for (const sort of sorting) {
        const column = columns.find(col => col.id === sort.id)
        if (!column?.accessorKey) continue

        const aValue = a[column.accessorKey]
        const bValue = b[column.accessorKey]

        let comparison = 0
        if (aValue < bValue) comparison = -1
        if (aValue > bValue) comparison = 1

        if (comparison !== 0) {
          return sort.desc ? -comparison : comparison
        }
      }
      return 0
    })
  }, [data, sorting, columns])

  const toggleSorting = (columnId: string) => {
    setSorting(current => {
      const existing = current.find(s => s.id === columnId)
      if (!existing) {
        return [{ id: columnId, desc: false }]
      }
      if (!existing.desc) {
        return [{ id: columnId, desc: true }]
      }
      return []
    })
  }

  return { sortedData, sorting, toggleSorting }
}

// Filtering Hook
function useFiltering<T>(data: T[], columns: ColumnDef<T>[]) {
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [columnFilters, setColumnFilters] = React.useState<FilterState[]>([])

  const filteredData = React.useMemo(() => {
    let filtered = data

    // Global filter
    if (globalFilter) {
      filtered = filtered.filter(row => {
        return columns.some(column => {
          if (!column.accessorKey) return false
          const value = row[column.accessorKey]
          return String(value).toLowerCase().includes(globalFilter.toLowerCase())
        })
      })
    }

    // Column filters
    columnFilters.forEach(filter => {
      const column = columns.find(col => col.id === filter.id)
      if (column?.accessorKey) {
        filtered = filtered.filter(row => {
          const value = row[column.accessorKey]
          return String(value).toLowerCase().includes(filter.value.toLowerCase())
        })
      }
    })

    return filtered
  }, [data, globalFilter, columnFilters, columns])

  return { 
    filteredData, 
    globalFilter, 
    setGlobalFilter, 
    columnFilters, 
    setColumnFilters 
  }
}

// Pagination Hook
function usePagination<T>(data: T[], pageSize: number = 10) {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  })

  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize
    const end = start + pagination.pageSize
    return data.slice(start, end)
  }, [data, pagination])

  const pageCount = Math.ceil(data.length / pagination.pageSize)

  const canPreviousPage = pagination.pageIndex > 0
  const canNextPage = pagination.pageIndex < pageCount - 1

  const previousPage = () => {
    setPagination(prev => ({
      ...prev,
      pageIndex: Math.max(0, prev.pageIndex - 1)
    }))
  }

  const nextPage = () => {
    setPagination(prev => ({
      ...prev,
      pageIndex: Math.min(pageCount - 1, prev.pageIndex + 1)
    }))
  }

  const setPageSize = (size: number) => {
    setPagination(prev => ({
      pageIndex: 0,
      pageSize: size,
    }))
  }

  return {
    paginatedData,
    pagination,
    pageCount,
    canPreviousPage,
    canNextPage,
    previousPage,
    nextPage,
    setPageSize,
  }
}

// Loading Skeleton Component
function DataTableSkeleton({ columns }: { columns: ColumnDef<any>[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.id}>
              <div className="h-4 bg-gray-700 rounded animate-pulse" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell key={column.id}>
                <div className="h-4 bg-gray-700 rounded animate-pulse" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// Main DataTable Component
export function DataTable<T>({
  data,
  columns,
  loading = false,
  sorting = true,
  filtering = true,
  pagination = true,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  searchPlaceholder = "Search...",
  emptyMessage = "No data available",
  className,
  onRowClick,
}: DataTableProps<T>) {
  // Hooks
  const { filteredData, globalFilter, setGlobalFilter } = useFiltering(data, columns)
  const { sortedData, sorting: sortingState, toggleSorting } = useSorting(filteredData, columns)
  const {
    paginatedData,
    pagination: paginationState,
    pageCount,
    canPreviousPage,
    canNextPage,
    previousPage,
    nextPage,
    setPageSize,
  } = usePagination(sortedData, pageSize)

  const finalData = pagination ? paginatedData : sortedData

  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {filtering && (
          <div className="flex items-center space-x-2">
            <div className="h-10 w-64 bg-gray-700 rounded animate-pulse" />
          </div>
        )}
        <DataTableSkeleton columns={columns} />
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and Filters */}
      {filtering && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Input
              icon={Search}
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-64"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  Clear filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead 
                key={column.id}
                style={{ width: column.width }}
                className={cn(
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right'
                )}
              >
                {sorting && column.sortable !== false ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold text-gray-300 hover:text-white"
                    onClick={() => toggleSorting(column.id)}
                  >
                    {column.header}
                    {(() => {
                      const sort = sortingState.find(s => s.id === column.id)
                      if (!sort) return <ChevronsUpDown className="ml-2 h-4 w-4" />
                      return sort.desc ? 
                        <ChevronDown className="ml-2 h-4 w-4" /> : 
                        <ChevronUp className="ml-2 h-4 w-4" />
                    })()}
                  </Button>
                ) : (
                  column.header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {finalData.length === 0 ? (
            <TableRow>
              <TableCell 
                colSpan={columns.length} 
                className="h-24 text-center text-gray-400"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            finalData.map((row, index) => (
              <TableRow 
                key={index}
                className={cn(
                  onRowClick && 'cursor-pointer',
                  'hover:bg-white/5'
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => {
                  const value = column.accessorKey ? row[column.accessorKey] : undefined
                  return (
                    <TableCell 
                      key={column.id}
                      className={cn(
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                    >
                      {column.cell ? column.cell({ row, value }) : String(value || '')}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pagination && finalData.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-400">
              Showing {paginationState.pageIndex * paginationState.pageSize + 1} to{' '}
              {Math.min(
                (paginationState.pageIndex + 1) * paginationState.pageSize,
                sortedData.length
              )}{' '}
              of {sortedData.length} results
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-400">Rows per page</p>
              <Select
                value={String(paginationState.pageSize)}
                onValueChange={(value) => setPageSize(Number(value))}
              >
                <SelectTrigger className="h-8 w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={previousPage}
                disabled={!canPreviousPage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-1">
                <p className="text-sm text-gray-400">
                  Page {paginationState.pageIndex + 1} of {pageCount}
                </p>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={!canNextPage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export type { ColumnDef, SortingState, FilterState, PaginationState }
