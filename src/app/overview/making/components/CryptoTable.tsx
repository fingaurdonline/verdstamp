// "use client"
// import * as React from "react"
// import {
//     ColumnDef,
//     ColumnFiltersState,
//     SortingState,
//     VisibilityState,
//     flexRender,
//     getCoreRowModel,
//     getFilteredRowModel,
//     getPaginationRowModel,
//     getSortedRowModel,
//     useReactTable,
// } from "@tanstack/react-table"
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { SearchIcon } from "lucide-react"
// import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md"


// const data: CryptoTableData[] = [

// ]

// export type CryptoTableData = {
//     id: string
//     pair: string
//     my_liquidity: string
//     total_liquidity: string
//     percentage: string
//     seven_Day_fee_dividend: string
//     one_day_apy: string
//     seven_day_apy: string
// }

// const columns: ColumnDef<CryptoTableData>[] = [
//     {
//         accessorKey: "pair",
//         header:
//             ({ column }) => (
//                 <div className="flex w-auto h-auto mr-16 ml-6">
//                     <button
//                         className="flex items-center justify-center gap-1"
//                         onClick={() => {
//                             column.toggleSorting(column.getIsSorted() === "asc")
//                         }}>
//                         Pair
//                         <span
//                             className="flex flex-col -space-y-2"
//                         >
//                             <MdOutlineArrowDropUp className="w-3.5 h-3.5 text-lnd-fg-muted" />
//                             <MdOutlineArrowDropDown className={`w-3.5 h-3.5 ${column.getIsSorted() ? "text-lnd-accent" : "text-lnd-fg-muted"}`} />
//                         </span>
//                     </button>
//                 </div>
//             ),
//         cell: ({ row }) => {
//             return (
//                 <div className="flex w-auto h-auto items-center py-2 space-x-2 border-t border-lnd-border">
//                     <div className="text-[0.784rem] text-lnd-fg-muted/60 font-medium">
//                         {row.getValue("pair")}
//                     </div>
//                 </div>
//             )
//         }
//     },
//     {
//         accessorKey: "my_liquidity",
//         header:
//             ({ column }) => (
//                 <div className="flex w-auto h-auto pr-1">
//                     <button
//                         className="flex items-center justify-center gap-1"
//                         onClick={() => {
//                             column.toggleSorting(column.getIsSorted() === "asc")
//                         }}>
//                         My Liquidity
//                         <span
//                             className="flex flex-col -space-y-2"
//                         >
//                             <MdOutlineArrowDropUp className="w-3.5 h-3.5 text-lnd-fg-muted" />
//                             <MdOutlineArrowDropDown className={`w-3.5 h-3.5 ${column.getIsSorted() ? "text-lnd-accent" : "text-lnd-fg-muted"}`} />
//                         </span>
//                     </button>
//                 </div>
//             ),
//         cell: ({ row }) => {
//             return (
//                 <div className="flex w-auto h-auto items-center py-2 space-x-2 border-t border-lnd-border">
//                     <div className="text-[0.78rem] text-lnd-fg-muted/60 font-medium">
//                         {row.getValue("my_liquidity")}
//                     </div>
//                 </div>
//             )
//         }
//     },
//     {
//         accessorKey: "total_liquidity",
//         header:
//             ({ column }) => (
//                 <div className="flex w-auto h-auto pr-1">
//                     <button
//                         className="flex items-center justify-center gap-1"
//                         onClick={() => {
//                             column.toggleSorting(column.getIsSorted() === "asc")
//                         }}>
//                         <span className="border-b border-lnd-border border-dashed border-spacing-[-10px]">
//                             Total Liquidity
//                         </span>
//                         <span
//                             className="flex flex-col -space-y-2"
//                         >
//                             <MdOutlineArrowDropUp className="w-3.5 h-3.5 text-lnd-fg-muted" />
//                             <MdOutlineArrowDropDown className={`w-3.5 h-3.5 ${column.getIsSorted() ? "text-lnd-accent" : "text-lnd-fg-muted"}`} />
//                         </span>
//                     </button>
//                 </div>
//             ),
//         cell: ({ row }) => {
//             return (
//                 <div className="flex w-auto h-auto items-center py-2 space-x-2 border-t border-lnd-border">
//                     <div className="text-[0.78rem] text-lnd-fg-muted/60 font-medium">
//                         {row.getValue("total_liquidity")}
//                     </div>
//                 </div>
//             )
//         }
//     },
//     {
//         accessorKey: "percentage",
//         header:
//             ({ column }) => (
//                 <div className="flex w-auto h-auto pr-1">
//                     <button
//                         className="flex items-center justify-center gap-1"
//                         onClick={() => {
//                             column.toggleSorting(column.getIsSorted() === "asc")
//                         }}>
//                         <span className="border-b border-lnd-border border-dashed border-spacing-[-10px]">
//                             Perce...
//                         </span>
//                         <span
//                             className="flex flex-col -space-y-2"
//                         >
//                             <MdOutlineArrowDropUp className="w-3.5 h-3.5 text-lnd-fg-muted" />
//                             <MdOutlineArrowDropDown className={`w-3.5 h-3.5 ${column.getIsSorted() ? "text-lnd-accent" : "text-lnd-fg-muted"}`} />
//                         </span>
//                     </button>
//                 </div>
//             ),
//         cell: ({ row }) => {
//             return (
//                 <div className="flex w-auto h-auto items-center py-2 space-x-2 border-t border-lnd-border">
//                     <div className="text-[0.78rem] text-lnd-fg-muted/60 font-medium">
//                         {row.getValue("percentage")}
//                     </div>
//                 </div>
//             )
//         }
//     },
//     {
//         accessorKey: "seven_Day_fee_dividend",
//         header:
//             ({ column }) => (
//                 <div className="flex w-auto h-auto pr-1">
//                     <button
//                         className="flex items-center justify-center gap-1"
//                         onClick={() => {
//                             column.toggleSorting(column.getIsSorted() === "asc")
//                         }}>
//                         <span>
//                             7-Day Fee Dividend
//                         </span>
//                         <span
//                             className="flex flex-col -space-y-2"
//                         >
//                             <MdOutlineArrowDropUp className="w-3.5 h-3.5 text-lnd-fg-muted" />
//                             <MdOutlineArrowDropDown className={`w-3.5 h-3.5 ${column.getIsSorted() ? "text-lnd-accent" : "text-lnd-fg-muted"}`} />
//                         </span>
//                     </button>
//                 </div>
//             ),
//         cell: ({ row }) => {
//             return (
//                 <div className="flex w-auto h-auto items-center py-2 space-x-2 border-t border-lnd-border">
//                     <div className="text-[0.78rem] text-lnd-fg-muted/60 font-medium">
//                         {row.getValue("seven_Day_fee_dividend")}
//                     </div>
//                 </div>
//             )
//         }
//     },
//     {
//         accessorKey: "one_day_apy",
//         header:
//             ({ column }) => (
//                 <div className="flex w-auto h-auto pr-1">
//                     <button
//                         className="flex items-center justify-center gap-1"
//                         onClick={() => {
//                             column.toggleSorting(column.getIsSorted() === "asc")
//                         }}>
//                         <span className="border-b border-lnd-border border-dashed border-spacing-[-10px]">
//                             1-Day APY
//                         </span>
//                         <span
//                             className="flex flex-col -space-y-2"
//                         >
//                             <MdOutlineArrowDropUp className="w-3.5 h-3.5 text-lnd-fg-muted" />
//                             <MdOutlineArrowDropDown className={`w-3.5 h-3.5 ${column.getIsSorted() ? "text-lnd-accent" : "text-lnd-fg-muted"}`} />
//                         </span>
//                     </button>
//                 </div>
//             ),
//         cell: ({ row }) => {
//             return (
//                 <div className="flex w-auto h-auto items-center py-2 space-x-2 border-t border-lnd-border">
//                     <div className="text-[0.78rem] text-lnd-fg-muted/60 font-medium">
//                         {row.getValue("one_day_apy")}
//                     </div>
//                 </div>
//             )
//         }
//     },
//     {
//         accessorKey: "seven_day_apy",
//         header:
//             ({ column }) => (
//                 <div className="flex w-auto h-auto pr-1">
//                     <button
//                         className="flex items-center justify-center gap-1"
//                         onClick={() => {
//                             column.toggleSorting(column.getIsSorted() === "asc")
//                         }}>
//                         <span className="border-b border-lnd-border border-dashed border-spacing-[-10px]">
//                             7-Day APY
//                         </span>
//                         <span
//                             className="flex flex-col -space-y-2"
//                         >
//                             <MdOutlineArrowDropUp className="w-3.5 h-3.5 text-lnd-fg-muted" />
//                             <MdOutlineArrowDropDown className={`w-3.5 h-3.5 ${column.getIsSorted() ? "text-lnd-accent" : "text-lnd-fg-muted"}`} />
//                         </span>
//                     </button>
//                 </div>
//             ),
//         cell: ({ row }) => {
//             return (
//                 <div className="flex w-auto h-auto items-center py-2 space-x-2 border-t border-lnd-border">
//                     <div className="text-[0.78rem] text-lnd-fg-muted/60 font-medium">
//                         {row.getValue("seven_day_apy")}
//                     </div>
//                 </div>
//             )
//         }
//     },
//     {
//         id: "operation",
//         header: () => <div className="w-auto h-auto flex justify-end pl-6 mr-6">Operation</div>,
//         enableHiding: false,
//         cell: ({ row }) => {
//             return (
//                 <div className="w-auto h-auto flex justify-end items-start py-4 text-[0.78rem] text-lnd-accent border-t border-lnd-border space-x-3 mr-6">
//                     <button>
//                         Add
//                     </button>
//                     <button>
//                         Remove
//                     </button>
//                 </div>
//             )
//         },
//     }
// ]

export default function CryptoTable() {
    // const [sorting, setSorting] = React.useState<SortingState>([])
    // const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    //     []
    // )
    // const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    // const [rowSelection, setRowSelection] = React.useState({})

    // const table = useReactTable({
    //     data,
    //     columns,
    //     onSortingChange: setSorting,
    //     onColumnFiltersChange: setColumnFilters,
    //     getCoreRowModel: getCoreRowModel(),
    //     getPaginationRowModel: getPaginationRowModel(),
    //     getSortedRowModel: getSortedRowModel(),
    //     getFilteredRowModel: getFilteredRowModel(),
    //     onColumnVisibilityChange: setColumnVisibility,
    //     onRowSelectionChange: setRowSelection,
    //     state: {
    //         sorting,
    //         columnFilters,
    //         columnVisibility,
    //         rowSelection,
    //     },
    // })

    // return (
    //     <div className="w-auto h-auto hidden lg:flex flex-col gap-3">
    //         <div className="w-full h-auto flex items-start px-1 pt-6 pb-2.5">
    //             <div className="flex w-fit h-fit group">
    //                 <SearchIcon className="flex relative text-lnd-fg-muted w-4 h-4 left-8 top-3" />
    //                 <Input
    //                     value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
    //                     onChange={(event) =>
    //                         table.getColumn("name")?.setFilterValue(event.target.value)
    //                     }
    //                     placeholder="Search"
    //                     className="w-60 rounded-lg focus:ring-offset-0 focus-visible:ring-offset-0 group-hover:bg-lnd-accent/10 group-hover:ring-1 group-hover:ring-lnd-accent/30 focus:ring-0 focus-visible:ring-0 placeholder:text-[.85rem] placeholder:font-Manrope placeholder:text-lnd-fg-muted bg-lnd-surface-2 group-hover:transition-all group-hover:duration-500 pl-10"
    //                 />
    //             </div>
    //         </div>
    //         <Table>
    //             <TableHeader
    //                 className="bg-lnd-surface-2/50"
    //             >
    //                 {table.getHeaderGroups().map((headerGroup) => (
    //                     <TableRow
    //                         key={headerGroup.id}>
    //                         {headerGroup.headers.map((header) => {
    //                             return (
    //                                 <TableHead
    //                                     className="text-[0.77rem] font-medium text-lnd-fg-muted"
    //                                     key={header.id}>
    //                                     {header.isPlaceholder
    //                                         ? null
    //                                         : flexRender(
    //                                             header.column.columnDef.header,
    //                                             header.getContext()
    //                                         )}
    //                                 </TableHead>
    //                             )
    //                         })}
    //                     </TableRow>
    //                 ))}
    //             </TableHeader>
    //             <TableBody>
    //                 {table.getRowModel().rows?.length ? (
    //                     table.getRowModel().rows.map((row) => (
    //                         <TableRow
    //                             key={row.id}
    //                             className="hover:bg-lnd-surface-2/50"
    //                         >
    //                             {row.getVisibleCells().map((cell) => (
    //                                 <TableCell key={cell.id}>
    //                                     {flexRender(
    //                                         cell.column.columnDef.cell,
    //                                         cell.getContext()
    //                                     )}
    //                                 </TableCell>
    //                             ))}
    //                         </TableRow>
    //                     ))
    //                 ) : (
    //                     <TableRow>
    //                         <TableCell
    //                             colSpan={columns.length}
    //                             className="h-24 text-center"
    //                         >
    //                             No results.
    //                         </TableCell>
    //                     </TableRow>
    //                 )}
    //             </TableBody>
    //         </Table>
    //     </div>
    // )
}