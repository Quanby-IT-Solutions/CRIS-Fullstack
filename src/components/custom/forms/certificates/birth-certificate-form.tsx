// BirthCertificateForm.tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Save } from 'lucide-react';
import { FormProvider } from 'react-hook-form';

import DelayedRegistrationForm from './form-cards/birth-cards/affidavit-for-delayed-registration';
import AffidavitOfPaternityForm from './form-cards/birth-cards/affidavit-of-paternity';
import AttendantInformationCard from './form-cards/birth-cards/attendant-information';
import CertificationOfInformantCard from './form-cards/birth-cards/certification-of-informant';
import ChildInformationCard from './form-cards/birth-cards/child-information-card';
import FatherInformationCard from './form-cards/birth-cards/father-information-card';
import MarriageInformationCard from './form-cards/birth-cards/marriage-parents-card';
import MotherInformationCard from './form-cards/birth-cards/mother-information-card';
import {
  PreparedByCard,
  ReceivedByCard,
  RegisteredAtOfficeCard,
} from './form-cards/shared-components/processing-details-cards';
import RegistryInformationCard from './form-cards/shared-components/registry-information-card';
import RemarksCard from './form-cards/shared-components/remarks-card';

import { FormType } from '@prisma/client';

import type { BirthCertificateFormProps } from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
import { useBirthCertificateForm } from '@/hooks/form-certificates-hooks/useBirthCertificateForm';
import { PDFViewer } from '@react-pdf/renderer';
import BirthCertificatePDF from './preview/birth-certificate/birth-certificate-pdf';

export default function BirthCertificateForm({
  open,
  onOpenChange,
  onCancel,
}: BirthCertificateFormProps) {
  const { formMethods, onSubmit, handleError } = useBirthCertificateForm({
    onOpenChange,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[95vw] w-[95vw] h-[95vh] max-h-[95vh] p-0'>
        <div className='h-full flex flex-col'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold text-center py-4'>
              Certificate of Live Birth
            </DialogTitle>
          </DialogHeader>

          <div className='flex flex-1 overflow-hidden'>
            <div className='w-1/2 border-r'>
              <ScrollArea className='h-[calc(95vh-120px)]'>
                <div className='p-6'>
                  <FormProvider {...formMethods}>
                    <form
                      onSubmit={formMethods.handleSubmit(onSubmit, handleError)}
                      className='space-y-6'
                    >
                      <RegistryInformationCard formType={FormType.BIRTH} />
                      <ChildInformationCard />
                      <MotherInformationCard />
                      <FatherInformationCard />
                      <MarriageInformationCard />
                      <AttendantInformationCard />
                      <CertificationOfInformantCard />
                      <PreparedByCard />
                      <ReceivedByCard />
                      <RegisteredAtOfficeCard
                        fieldPrefix='registeredByOffice'
                        cardTitle='Registered at the Office of Civil Registrar'
                      />
                      <RemarksCard
                        fieldName='remarks'
                        cardTitle='Birth Certificate Remarks'
                        label='Additional Remarks'
                        placeholder='Enter any additional remarks or annotations'
                      />
                      <AffidavitOfPaternityForm />
                      <DelayedRegistrationForm />

                      <DialogFooter>
                        <Button
                          type='button'
                          variant='outline'
                          className='h-10'
                          onClick={onCancel}
                        >
                          Cancel
                        </Button>
                        <Button type='submit' className='h-10 ml-2'>
                          <Save className='mr-2 h-4 w-4' />
                          Save Registration
                        </Button>
                      </DialogFooter>
                    </form>
                  </FormProvider>
                </div>
              </ScrollArea>
            </div>

            <div className='w-1/2'>
              <div className='h-[calc(95vh-120px)] p-6'>
                {/* You can add your PDF viewer or preview component here */}
                <PDFViewer width='100%' height='100%'>
                  <BirthCertificatePDF data={formMethods.watch()} />
                </PDFViewer>
                ;
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
