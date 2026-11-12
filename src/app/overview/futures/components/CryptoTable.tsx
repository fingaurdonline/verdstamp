"use client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import * as React from "react"
import { SortingState, ColumnFiltersState, VisibilityState, useReactTable, ColumnDef, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table'
import useCryptoList from "@/hooks/useCryptoData"
import Loader from "@/app/(landing)/components/Loader"
import NoData from "@/components/icons/NoData"



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

    return (
        <>
            <div className="w-full h-auto flex flex-col gap-3 dark:text-lnd-fg">
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
                    <TableBody className="w-full">
                        {table.getRowModel()?.rows?.length !== 0 ?
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="hover:bg-lnd-surface-2/50 h-fit dark:hover:bg-lnd-surface-2"
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
                            : isLoading || crypto === undefined ?
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
                                            <div className="flex flex-col items-center justify-center h-full w-full bg-lnd-surface dark:bg-lnd-surface dark:text-lnd-fg-muted">
                                                <NoData className="w-20 h-20" />
                                                No data available
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                    </TableBody>
                </Table>
                </div>
            </div>
        </>
    )
}