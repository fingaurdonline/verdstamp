"use client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import * as React from "react"
import { SortingState, ColumnFiltersState, VisibilityState, useReactTable, ColumnDef, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table'
import useCryptoList from "@/hooks/useCryptoData"
import Loader from "@/app/(landing)/components/Loader"
import NoData from "@/components/icons/NoData"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"



type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}




export default function CryptoTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })
    const { data: crypto, isLoading } = useCryptoList()
    // pagination state + effects to drive tanstack table pagination
    const [{ pageIndex, pageSize }, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })

    // setter that accepts either a number (1-based page) or an updater function
    const setPage = (val: number | ((prev: number) => number)) => {
        setPagination(prev => {
            const current = prev.pageIndex + 1
            const newPage = typeof val === "function" ? val(current) : val
            return { ...prev, pageIndex: Math.max(0, newPage - 1) }
        })
    }

    const setPageSize = (size: number) => {
        setPagination(prev => ({ ...prev, pageSize: size, pageIndex: 0 }))
    }

    const total = data?.length ?? 0
    const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(total / pageSize)) : 1

    React.useEffect(() => {
        // keep table in sync when local pageIndex changes
        table.setPageIndex(pageIndex)
    }, [table, pageIndex])

    React.useEffect(() => {
        // keep table in sync when local pageSize changes
        table.setPageSize(pageSize)
    }, [table, pageSize])

    const currentPage = (table.getState().pagination.pageIndex ?? 0) + 1

    return (
        <>
            <div className="w-full h-auto flex flex-col gap-3">
                <div className="w-full h-auto flex items-start px-1 pt-6 pb-2.5">
                    <div className="flex w-fit h-fit group">
                        <SearchIcon className="flex relative text-lnd-fg-muted w-4 h-4 left-8 top-3 dark:text-lnd-fg" />
                        <Input
                            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("name")?.setFilterValue(event.target.value)
                            }
                            placeholder="Search"
                            className="w-60 rounded-lg focus:ring-offset-0 focus-visible:ring-offset-0 group-hover:bg-lnd-accent/10 group-hover:ring-1 group-hover:ring-lnd-accent/30 focus:ring-0 focus-visible:ring-0 placeholder:text-[.85rem] placeholder:font-Manrope placeholder:text-lnd-fg-muted bg-lnd-surface-2 group-hover:transition-all group-hover:duration-500 pl-10 dark:bg-lnd-surface dark:group-hover:bg-lnd-accent/10 dark:text-lnd-fg dark:placeholder:text-lnd-fg dark:border-lnd-border"
                        />
                    </div>
                </div>
                <Table>
                    <TableHeader
                        className="bg-lnd-surface-2/50 dark:bg-lnd-surface"
                    >
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id} className="dark:border-lnd-border">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            className="text-[0.784rem] text-lnd-fg-muted dark:text-lnd-fg"
                                            key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="w-full dark:bg-lnd-surface">
                        {table.getRowModel().rows?.length !== 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="hover:bg-lnd-surface-2/50 h-fit dark:hover:bg-lnd-surface dark:border-lnd-border"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell className="h-fit p-0 px-4 dark:text-lnd-fg" key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : isLoading || crypto === undefined ?
                            (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-80 p-0">
                                        <div className="flex items-center justify-center h-full w-full">
                                            <Loader />
                                        </div>
                                    </TableCell>
                                </TableRow>

                            )
                            : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-80 p-0">
                                        <div className="flex flex-col items-center justify-center h-full w-full bg-lnd-surface dark:bg-lnd-surface dark:text-lnd-fg">
                                            <NoData className="w-20 h-20" />
                                            No data available
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table>
            </div>
            <div className="hidden lg:flex items-center justify-between py-2 px-2">
                <div className="flex items-center space-x-3">
                    <div className="text-sm text-lnd-accent dark:text-lnd-accent">
                        Showing Display:
                    </div>
                    <RadioGroup
                        value={pageSize >= total && total > 0 ? "all" : String(pageSize)}
                        onValueChange={(val) => {
                            if (val === "all") {
                                setPageSize(total || 999)
                                setPage(1)
                            } else {
                                setPageSize(Number(val))
                                setPage(1)
                            }
                        }}
                        className="flex items-center space-x-3"
                    >
                        <label className="inline-flex items-center space-x-2">
                            <RadioGroupItem value="6" id="size-6" className="h-4 w-4 text-lnd-accent border-lnd-accent/25 rounded-full focus:ring-2 focus:ring-lnd-accent/30 dark:border-lnd-accent/55 dark:text-lnd-accent dark:focus:ring-lnd-accent/30" />
                            <span className="text-sm text-lnd-fg dark:text-lnd-fg">6</span>
                        </label>

                        <label className="inline-flex items-center space-x-2">
                            <RadioGroupItem value="10" id="size-10" className="h-4 w-4 text-lnd-accent border-lnd-accent/25 rounded-full focus:ring-2 focus:ring-lnd-accent/30 dark:border-lnd-accent/55 dark:text-lnd-accent dark:focus:ring-lnd-accent/30" />
                            <span className="text-sm text-lnd-fg dark:text-lnd-fg">10</span>
                        </label>

                        <label className="inline-flex items-center space-x-2">
                            <RadioGroupItem value="20" id="size-20" className="h-4 w-4 text-lnd-accent border-lnd-accent/25 rounded-full focus:ring-2 focus:ring-lnd-accent/30 dark:border-lnd-accent/55 dark:text-lnd-accent dark:focus:ring-lnd-accent/30" />
                            <span className="text-sm text-lnd-fg dark:text-lnd-fg">20</span>
                        </label>

                        <label className="inline-flex items-center space-x-2">
                            <RadioGroupItem value="50" id="size-50" className="h-4 w-4 text-lnd-accent border-lnd-accent/25 rounded-full focus:ring-2 focus:ring-lnd-accent/30 dark:border-lnd-accent/55 dark:text-lnd-accent dark:focus:ring-lnd-accent/30" />
                            <span className="text-sm text-lnd-fg dark:text-lnd-fg">50</span>
                        </label>
                    </RadioGroup>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded text-sm text-lnd-accent border-lnd-accent/25 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lnd-accent/10 dark:text-lnd-accent dark:border-lnd-accent/55 dark:hover:bg-lnd-accent/15 dark:bg-lnd-surface"
                        aria-disabled={currentPage === 1}
                    >
                        Prev
                    </button>

                    <div className="flex items-center space-x-2">
                        {totalPages > 4 ? (
                            (() => {
                                const start = Math.min(currentPage, totalPages - 2) // ensure room for "last"
                                const first = start
                                const second = start + 1
                                const pages: number[] = [first, second].filter((p) => p >= 1 && p <= totalPages)

                                return (
                                    <>
                                        {pages.map((p) => {
                                            const isActive = p === currentPage
                                            return (
                                                <button
                                                    key={p}
                                                    onClick={() => setPage(p)}
                                                    className={
                                                        "px-3 py-1 rounded text-sm " +
                                                    (isActive
                                                        ? "bg-lnd-accent text-lnd-accent-fg dark:bg-lnd-accent dark:text-lnd-accent-fg"
                                                        : "border border-lnd-accent/25 text-lnd-accent hover:bg-lnd-accent/10 dark:border-lnd-accent/55 dark:text-lnd-accent dark:hover:bg-lnd-accent/15 dark:bg-lnd-surface")
                                                    }
                                                    aria-current={isActive ? "page" : undefined}
                                                >
                                                    {p}
                                                </button>
                                            )
                                        })}

                                        {pages[pages.length - 1] < totalPages - 1 && (
                                            <span className="px-3 py-1 text-sm text-lnd-fg-muted dark:text-lnd-fg-muted">…</span>
                                        )}

                                        {pages[pages.length - 1] < totalPages && (
                                            <button
                                                key={totalPages}
                                                onClick={() => setPage(totalPages)}
                                                className={
                                                    "px-3 py-1 rounded text-sm " +
                                                    (currentPage === totalPages
                                                        ? "bg-lnd-accent text-lnd-accent-fg dark:bg-lnd-accent dark:text-lnd-accent-fg"
                                                        : "border border-lnd-accent/25 text-lnd-accent hover:bg-lnd-accent/10 dark:border-lnd-accent/55 dark:text-lnd-accent dark:hover:bg-lnd-accent/15 dark:bg-lnd-surface")
                                                }
                                                aria-current={currentPage === totalPages ? "page" : undefined}
                                            >
                                                {totalPages}
                                            </button>
                                        )}
                                    </>
                                )
                            })()
                        ) : (
                            Array.from({ length: totalPages }, (_, i) => {
                                const p = i + 1
                                const isActive = p === currentPage
                                return (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={
                                            "px-3 py-1 rounded text-sm " +
                                            (isActive
                                                ? "bg-lnd-accent text-lnd-accent-fg dark:bg-lnd-accent dark:text-lnd-accent-fg"
                                                : "border border-lnd-accent/25 text-lnd-accent hover:bg-lnd-accent/10 dark:border-lnd-accent/55 dark:text-lnd-accent dark:hover:bg-lnd-accent/15 dark:bg-lnd-surface")
                                        }
                                        aria-current={isActive ? "page" : undefined}
                                    >
                                        {p}
                                    </button>
                                )
                            })
                        )}
                    </div>

                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded bg-lnd-accent text-lnd-accent-fg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lnd-accent/90 dark:bg-lnd-accent dark:hover:bg-lnd-accent/90 dark:text-lnd-accent-fg"
                        aria-disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    )
}