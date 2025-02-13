'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Icons } from '@/components/ui/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

import BirthCertificateForm from '@/components/custom/forms/certificates/birth-certificate-form';

export function AddCivilRegistryFormDialog() {
  const { t } = useTranslation(); // Initialize translation hook
  const [open, setOpen] = useState(false);
  const [marriageCertificateOpen, setMarriageCertificateOpen] = useState(false);
  const [birthCertificateFormOpen, setBirthCertificateFormOpen] =
    useState(false);
  const [deathCertificateOpen, setDeathCertificateOpen] = useState(false);

  const handleFormSelect = (formType: string) => {
    setOpen(false);
    switch (formType) {
      case 'death-certificate':
        // Handle death certificate form
        setDeathCertificateOpen(true);
        break;
      case 'marriage-certificate':
        setMarriageCertificateOpen(true);
        break;
      case 'live-birth-certificate':
        setBirthCertificateFormOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className=' h-fit'>
          <Button>
            <Icons.plus className='mr-2 h-4 w-4' />
            {t('Create New Form')} {/* Translatable text */}
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-4xl'>
          <DialogHeader>
            <DialogTitle className='text-center text-xl font-semibold'>
              {t('Select Form Type')} {/* Translatable title */}
            </DialogTitle>
          </DialogHeader>

          <div className='flex gap-4'>
            <Card
              className='flex-1 cursor-pointer hover:bg-accent transition-colors border dark:border-border'
              onClick={() => handleFormSelect('live-birth-certificate')}
            >
              <CardHeader>
                <CardTitle className='text-center text-base'>
                  {t('Certificate of Live Birth')}{' '}
                  {/* Translatable form name */}
                </CardTitle>
              </CardHeader>
              <CardContent className='text-center'>
                <p className='text-sm text-muted-foreground'>
                  {t('(Municipal Form No. 102)')} {/* Translatable text */}
                </p>
              </CardContent>
            </Card>
            <Card
              className='flex-1 cursor-pointer hover:bg-accent transition-colors border dark:border-border'
              onClick={() => handleFormSelect('death-certificate')}
            >
              <CardHeader>
                <CardTitle className='text-center text-base'>
                  {t('Certificate of Death')} {/* Translatable form name */}
                </CardTitle>
              </CardHeader>
              <CardContent className='text-center'>
                <p className='text-sm text-muted-foreground'>
                  {t('(Municipal Form No. 103)')} {/* Translatable text */}
                </p>
              </CardContent>
            </Card>

            <Card
              className='flex-1 cursor-pointer hover:bg-accent transition-colors border dark:border-border'
              onClick={() => handleFormSelect('marriage-certificate')}
            >
              <CardHeader>
                <CardTitle className='text-center text-base'>
                  {t('Certificate of Marriage')} {/* Translatable form name */}
                </CardTitle>
              </CardHeader>
              <CardContent className='text-center'>
                <p className='text-sm text-muted-foreground'>
                  {t('(Municipal Form No. 97)')} {/* Translatable text */}
                </p>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* <MarriageCertificateForm
        open={marriageCertificateOpen}
        onOpenChange={setMarriageCertificateOpen}
        onCancel={() => {
          setMarriageCertificateOpen(false)
          setTimeout(() => setOpen(true), 0)
        }}
      /> */}

      <BirthCertificateForm
        open={birthCertificateFormOpen}
        onOpenChange={setBirthCertificateFormOpen}
        onCancel={() => {
          setBirthCertificateFormOpen(false);
          setTimeout(() => setOpen(true), 0);
        }}
      />

      {/* <DeathCertificateForm
        open={deathCertificateOpen}
        onOpenChange={setDeathCertificateOpen}
        onCancel={() => {
          setDeathCertificateOpen(false)
          setTimeout(() => setOpen(true), 0)
        }}
      /> */}
    </>
  );
}
