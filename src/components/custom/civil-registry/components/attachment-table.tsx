// src/components/custom/civil-registry/components/attachment-table.tsx
'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Attachment,
    BirthCertificateForm,
    CertifiedCopy,
    DeathCertificateForm,
    FormType,
    MarriageCertificateForm,
    Permission,
} from '@prisma/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Icons } from '@/components/ui/icons'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover'

import BirthAnnotationForm from '@/components/custom/forms/annotations/birth-cert-annotation'
import DeathAnnotationForm from '@/components/custom/forms/annotations/death-annotation'
import MarriageAnnotationForm from '@/components/custom/forms/annotations/marriage-annotation-form'
import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action'
import { useUser } from '@/context/user-context'
import { hasPermission } from '@/types/auth'

// Extend Attachment to include certifiedCopies.
export interface AttachmentWithCertifiedCopies extends Attachment {
    certifiedCopies?: CertifiedCopy[]
}

interface AttachmentsTableProps {
    attachments: AttachmentWithCertifiedCopies[]
    onAttachmentDeleted?: (deletedId: string) => void
    canDelete?: boolean
    formType: FormType
    formData?: BaseRegistryFormWithRelations & {
        birthCertificateForm?: BirthCertificateForm | null
        deathCertificateForm?: DeathCertificateForm | null
        marriageCertificateForm?: MarriageCertificateForm | null
    }
}

export const AttachmentsTable: React.FC<AttachmentsTableProps> = ({
    attachments,
    onAttachmentDeleted,
    canDelete = false,
    formType,
    formData,
}) => {
    const { t } = useTranslation()
    const { permissions } = useUser()

    // Global export permission: allow if in development or if user has DOCUMENT_EXPORT permission.
    const exportAllowed =
        process.env.NEXT_PUBLIC_NODE_ENV === 'development' ||
        hasPermission(permissions, Permission.DOCUMENT_EXPORT)

    // State for annotation form dialog.
    const [annotationFormOpen, setAnnotationFormOpen] = useState(false)

    // Handler to open the annotation dialog.
    const handleIssueCertificate = (attachment: AttachmentWithCertifiedCopies) => {
        setAnnotationFormOpen(true)
    }

    const handleDelete = async (attachmentId: string) => {
        try {
            const res = await fetch(`/api/attachments/${attachmentId}`, {
                method: 'DELETE',
            })
            const json = await res.json()
            if (!res.ok) {
                throw new Error(json.error || t('Failed to delete attachment'))
            }
            toast.success(t('Attachment deleted successfully'))
            onAttachmentDeleted?.(attachmentId)
        } catch (error: unknown) {
            console.error('Delete error:', error)
            const errMsg =
                error instanceof Error ? error.message : t('Failed to delete attachment')
            toast.error(errMsg)
        }
    }

    const handleExport = async (attachment: AttachmentWithCertifiedCopies) => {
        try {
            // Check if a certified true copy (CTC) exists.
            const hasCTC = (attachment.certifiedCopies?.length ?? 0) > 0

            if (!hasCTC) {
                toast.error(t('You need to issue a certified true copy (CTC) for export'))
                return
            }
            if (!exportAllowed) {
                toast.error(t('You do not have credentials to export this document'))
                return
            }

            const exportUrl = `/api/attachments/export?attachmentId=${attachment.id}&zip=true`
            const res = await fetch(exportUrl)
            if (!res.ok) {
                throw new Error(t('Failed to export attachment'))
            }
            const blob = await res.blob()

            // Extract the filename from the Content-Disposition header set by the API.
            const disposition = res.headers.get('Content-Disposition')
            let filename = ''
            if (disposition && disposition.indexOf('filename=') !== -1) {
                const match = disposition.match(/filename="([^"]+)"/)
                if (match && match[1]) {
                    filename = match[1]
                }
            }

            // Fallback: use the attachment filename if the header is not present.
            if (!filename) {
                filename = attachment.fileName.replace(/\.[^/.]+$/, '') + '.zip'
            }

            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            // Use the filename extracted from the response header.
            a.download = filename
            a.click()
            window.URL.revokeObjectURL(url)
        } catch (error: unknown) {
            console.error('Export error:', error)
            const errMsg =
                error instanceof Error ? error.message : t('Failed to export attachment')
            toast.error(errMsg)
        }
    }

    return (
        <>
            {attachments.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                    {t('No attachments available.')}
                </p>
            ) : (
                <>
                    <Table className="min-w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-4 py-2 text-left">{t('File Name')}</TableHead>
                                <TableHead className="px-4 py-2 text-left">{t('Uploaded On')}</TableHead>
                                <TableHead className="px-4 py-2 text-left">{t('CTC Issued')}</TableHead>
                                <TableHead className="px-4 py-2 text-left">{t('Actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attachments.map((attachment) => {
                                const hasCTC = (attachment.certifiedCopies?.length ?? 0) > 0
                                const disableExport = !exportAllowed || !hasCTC

                                return (
                                    <TableRow key={attachment.id} className="border-b">
                                        <TableCell className="px-4 py-2">
                                            <span className="block truncate max-w-xs" title={attachment.fileName}>
                                                {attachment.fileName}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-2">
                                            {new Date(attachment.uploadedAt).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="px-4 py-2">
                                            {hasCTC ? (
                                                <span className="text-green-600 font-semibold">{t('Yes')}</span>
                                            ) : (
                                                <span className="text-gray-500">{t('No')}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-4 py-2">
                                            <div className="flex items-center gap-2">
                                                {canDelete && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="destructive" size="sm">
                                                                {t('Delete')}
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>{t('Are you absolutely sure?')}</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    {t('This action cannot be undone. This will permanently delete the attachment.')}
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(attachment.id)}>
                                                                    {t('Delete')}
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}

                                                {disableExport ? (
                                                    <div className="flex items-center gap-1">
                                                        <Button variant="outline" size="sm" disabled>
                                                            {t('Export')}
                                                        </Button>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button variant="ghost" size="sm">
                                                                    <Icons.infoCircledIcon className="h-4 w-4" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-64">
                                                                <p>{t('You need to issue a certified true copy (CTC) before you can export this document.')}</p>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleExport(attachment)}
                                                    >
                                                        {t('Export (ZIP)')}
                                                    </Button>
                                                )}

                                                <Button
                                                    onClick={() => handleIssueCertificate(attachment)}
                                                    variant="secondary"
                                                    size="sm"
                                                >
                                                    <Icons.files className="mr-2 h-4 w-4" />
                                                    {t('issueCertificate')}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>

                    {formType === 'BIRTH' && (
                        <BirthAnnotationForm
                            open={annotationFormOpen}
                            onOpenChange={setAnnotationFormOpen}
                            onCancel={() => setAnnotationFormOpen(false)}
                            formData={formData!}
                        />
                    )}
                    {formType === 'DEATH' && (
                        <DeathAnnotationForm
                            open={annotationFormOpen}
                            onOpenChange={setAnnotationFormOpen}
                            onCancel={() => setAnnotationFormOpen(false)}
                            formData={formData!}
                        />
                    )}
                    {formType === 'MARRIAGE' && (
                        <MarriageAnnotationForm
                            open={annotationFormOpen}
                            onOpenChange={setAnnotationFormOpen}
                            onCancel={() => setAnnotationFormOpen(false)}
                            formData={formData!}
                        />
                    )}
                </>
            )}
        </>
    )
}
