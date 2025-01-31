'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next' // Import useTranslation
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import BirthAnnotationForm from '@/components/custom/forms/annotations/birthcert'
import DeathAnnotationForm from '@/components/custom/forms/annotations/death-annotation-form'
import BirthCertificateForm from '@/components/custom/forms/certificates/birth-certificate-form'
import DeathCertificateForm from '@/components/custom/forms/certificates/death-certificate-form'
import MarriageAnnotationForm from '@/components/custom/forms/annotations/marriage-annotation-form'
import MarriageCertificateForm from '@/components/custom/forms/certificates/marriage-certificate-form'

export function FormSelection() {
    const { t } = useTranslation() // Access translation function
    const [open, setOpen] = useState(false)
    const [birthFormOpen, setBirthFormOpen] = useState(false)
    const [deathFormOpen, setDeathFormOpen] = useState(false)
    const [marriageFormOpen, setMarriageFormOpen] = useState(false)
    const [marriageCertificateOpen, setMarriageCertificateOpen] = useState(false)
    const [birthCertificateFormOpen, setBirthCertificateFormOpen] = useState(false)
    const [deathCertificateOpen, setDeathCertificateOpen] = useState(false)

    const handleFormSelect = (formType: string) => {
        setOpen(false)
        switch (formType) {
            case 'birth-annotation':
                setBirthFormOpen(true)
                break
            case 'death-annotation':
                setDeathFormOpen(true)
                break
            case 'marriage-annotation':
                setMarriageFormOpen(true)
                break
            default:
                break
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant={"default"}>
                        <Icons.plus className="mr-2 h-4 w-4" />
                        {t('formSelection.issueCertificate')}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl font-semibold">{t('formSelection.selectFormType')}</DialogTitle>
                    </DialogHeader>

                    <div className="flex gap-4">
                        <Card className="flex-1 cursor-pointer hover:bg-accent transition-colors border dark:border-border" onClick={() => handleFormSelect('birth-annotation')}>
                            <CardHeader>
                                <CardTitle className="text-center text-base">{t('formSelection.birthForm')}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-sm text-muted-foreground">{t('formSelection.birthAvailable')}</p>
                            </CardContent>
                        </Card>
                        <Card className="flex-1 cursor-pointer hover:bg-accent transition-colors border dark:border-border" onClick={() => handleFormSelect('death-annotation')}>
                            <CardHeader>
                                <CardTitle className="text-center text-base">{t('formSelection.deathForm')}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-sm text-muted-foreground">{t('formSelection.deathAvailable')}</p>
                            </CardContent>
                        </Card>
                        <Card className="flex-1 cursor-pointer hover:bg-accent transition-colors border dark:border-border" onClick={() => handleFormSelect('marriage-annotation')}>
                            <CardHeader>
                                <CardTitle className="text-center text-base">{t('formSelection.marriageForm')}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-sm text-muted-foreground">{t('formSelection.marriageAvailable')}</p>
                            </CardContent>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>

            <BirthAnnotationForm open={birthFormOpen} onOpenChange={setBirthFormOpen} onCancel={() => setBirthFormOpen(false)} />
            <DeathAnnotationForm open={deathFormOpen} onOpenChange={setDeathFormOpen} onCancel={() => setDeathFormOpen(false)} />
            <MarriageAnnotationForm open={marriageFormOpen} onOpenChange={setMarriageFormOpen} onCancel={() => setMarriageFormOpen(false)} />
            <BirthCertificateForm open={birthCertificateFormOpen} onOpenChange={setBirthCertificateFormOpen} onCancel={() => setBirthCertificateFormOpen(false)} />
            <DeathCertificateForm open={deathCertificateOpen} onOpenChange={setDeathCertificateOpen} onCancel={() => setDeathCertificateOpen(false)} />
            <MarriageCertificateForm open={marriageCertificateOpen} onOpenChange={setMarriageCertificateOpen} onCancel={() => setMarriageCertificateOpen(false)} />
        </>
    )
}
