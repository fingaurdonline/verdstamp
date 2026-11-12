"use client"
import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"



type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}


export default function CryptoTable<TData, TValue>({
    columns,
    data,
  }: DataTableProps<TData, TValue>){
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

    
    return (
        <div className="w-auto h-auto hidden lg:flex flex-col gap-3">
            <div className="w-full h-auto flex items-start px-1 pt-6 pb-2.5">
                <div className="flex w-fit h-fit group">
                    <SearchIcon className="flex relative text-lnd-fg-muted w-4 h-4 left-8 top-3 dark:text-lnd-fg-muted" />
                    <Input
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        placeholder="Search"
                        className="w-60 rounded-lg focus:ring-offset-0 focus-visible:ring-offset-0 group-hover:bg-lnd-accent/10 group-hover:ring-1 group-hover:ring-lnd-accent/30 focus:ring-0 focus-visible:ring-0 placeholder:text-[.85rem] placeholder:font-Manrope placeholder:text-lnd-fg-muted bg-lnd-surface-2 group-hover:transition-all group-hover:duration-500 pl-10 dark:bg-lnd-surface dark:text-lnd-fg dark:placeholder:text-lnd-fg-muted dark:group-hover:bg-lnd-accent/15 dark:group-hover:ring-lnd-accent/30"
                    />
                </div>
            </div>
            <div className="w-full overflow-x-auto">
            <Table>
                <TableHeader
                    className="bg-lnd-surface-2/50 dark:bg-lnd-surface"
                >
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead
                                        className="text-[0.784rem] text-lnd-fg-muted dark:text-lnd-fg-muted"
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
                <TableBody className="dark:bg-lnd-surface">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="hover:bg-lnd-surface-2/50 dark:hover:bg-lnd-surface-2"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="dark:text-lnd-fg">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center dark:text-lnd-fg-muted"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            </div>
        </div>
    )
}