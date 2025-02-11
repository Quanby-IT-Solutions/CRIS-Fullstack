'use client'


import {
    ColumnDef,
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
} from '@tanstack/react-table'
import { Role, Permission } from '@prisma/client'

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
import { Card, CardContent } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { useTranslation } from 'react-i18next'
import { useUser } from '@/context/user-context'
import { hasPermission } from '@/types/auth'
import { columns } from './columns'
import React from 'react'

type RoleValue = string | number | boolean | Date | null | undefined

interface DataTableProps<TData extends Role & { permissions: Permission[]; users: { id: string; name: string; email: string }[] }> {
    data: TData[]
    searchKey?: string
    selection?: boolean
}

export function DataTable<TData extends Role & { permissions: Permission[]; users: { id: string; name: string; email: string }[] }>({
    data,
    selection = true,
}: DataTableProps<TData>) {
    const { t } = useTranslation()
    const { permissions } = useUser()
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])

    // Filter out the actions column if user doesn't have permission
    const canViewDetails = hasPermission(permissions ?? [], Permission.ROLE_READ)
    const canEdit = hasPermission(permissions ?? [], Permission.ROLE_UPDATE)
    const canDelete = hasPermission(permissions ?? [], Permission.ROLE_DELETE)

    const filteredColumns = React.useMemo(() => {
        return columns.filter(column => {
            if (column.id === 'actions') {
                return canViewDetails || canEdit || canDelete
            }
            return true
        })
    }, [canViewDetails, canEdit, canDelete])

    const table = useReactTable({
        data,
        columns: filteredColumns as ColumnDef<TData, RoleValue>[],
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
        <div className='space-y-4'>
            <DataTableToolbar table={table} />
            <div className='rounded-md border bg-popover shadow-md'>
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
                                <TableCell colSpan={filteredColumns.length} className="h-24 text-center">
                                    <Card className="mx-auto max-w-md">
                                        <CardContent className="flex flex-col items-center space-y-4 p-6">
                                            <div className="rounded-full bg-muted p-3">
                                                <Icons.search className="h-6 w-6" />
                                            </div>
                                            <p className="text-lg font-semibold">
                                                {t('No results found')}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {columnFilters.length > 0
                                                    ? t('Try adjusting your filters or search terms')
                                                    : t('No roles have been created yet')}
                                            </p>
                                        </CardContent>
                                    </Card>
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