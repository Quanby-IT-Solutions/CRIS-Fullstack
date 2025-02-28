'use client'

import React, { useEffect, useState } from 'react'
import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    ColumnDef,
} from '@tanstack/react-table'
import type { Feedback } from '@prisma/client'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/custom/table/data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'
import { CardContent } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'
import Lottie from 'lottie-react'
import certificateAnimation from '@lottie/blue.json'

export interface DataTableProps<TData extends Feedback & { user: { name: string; email: string; image: string | null } | null }> {
    data: TData[]
    columns: ColumnDef<TData>[]
    searchKey?: string
    selection?: boolean
}

export function DataTable<TData extends Feedback & { user: { name: string; email: string; image: string | null } | null }>(props: DataTableProps<TData>) {
    const { data, columns, selection = true } = props
    const { t } = useTranslation()
    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useState<SortingState>([])
    const [shake, setShake] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setShake((prev) => !prev)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        enableRowSelection: selection,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    return (
        <div className="space-y-4">
            <DataTableToolbar table={table} />
            <div className="rounded-md border bg-popover shadow-md">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <div className="mx-auto max-w-lg">
                                        <CardContent className="flex flex-col items-center space-y-4 p-6">
                                            <div className="w-40 h-40">
                                                <Lottie
                                                    animationData={certificateAnimation}
                                                    loop
                                                    autoplay
                                                    className="w-full h-full"
                                                />
                                            </div>
                                            <p
                                                className={`text-lg font-semibold transition-transform ${shake ? 'animate-[wiggle_0.4s_ease-in-out]' : ''}`}
                                            >
                                                {t('No results found')}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {columnFilters.length > 0
                                                    ? t('Try adjusting your filters or search terms')
                                                    : t('No feedback has been submitted yet')}
                                            </p>
                                        </CardContent>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} showSelected={selection} />
        </div>
    )
}
