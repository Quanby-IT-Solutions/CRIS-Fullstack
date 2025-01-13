'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createBirthCertificate } from '@/hooks/form-certificate-actions';
import {
  BirthCertificateFormProps,
  BirthCertificateFormValues,
  birthCertificateSchema,
  defaultBirthCertificateValues,
} from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import { zodResolver } from '@hookform/resolvers/zod';
import { PDFViewer } from '@react-pdf/renderer';
import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  ConfirmationDialog,
  shouldSkipAlert,
} from '../../confirmation-dialog/confirmation-dialog';
import AttendantInformationCard from './form-cards/birth-cards/attendant-information';
import CertificationOfInformantCard from './form-cards/birth-cards/certification-of-informant';
import ChildInformationCard from './form-cards/birth-cards/child-information-card';
import FatherInformationCard from './form-cards/birth-cards/father-information-card';
import MarriageOfParentsCard from './form-cards/birth-cards/marriage-parents-card';
import MotherInformationCard from './form-cards/birth-cards/mother-information-card';
import PreparedByCard from './form-cards/birth-cards/prepared-by-card';
import ReceivedByCard from './form-cards/birth-cards/received-by';
import RegisteredAtOfficeCard from './form-cards/birth-cards/registered-at-office-card';
import RegistryInformationCard from './form-cards/birth-cards/registry-information-card';
import RemarksCard from './form-cards/birth-cards/remarks';
import BirthCertificatePDF from './preview/birth-certificate/birth-certificate-pdf';

export default function BirthCertificateForm({
  open,
  onOpenChange,
  onCancel,
}: BirthCertificateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [pendingSubmission, setPendingSubmission] =
    useState<BirthCertificateFormValues | null>(null);

  const form = useForm<BirthCertificateFormValues>({
    resolver: zodResolver(birthCertificateSchema),
    defaultValues: defaultBirthCertificateValues,
  });

  const onSubmit = async (values: BirthCertificateFormValues) => {
    try {
      setIsSubmitting(true);
      const result = await createBirthCertificate(values);

      if (result.success) {
        toast.success('Birth certificate has been registered successfully');
        onOpenChange(false);
        form.reset();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to register birth certificate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const transformFormDataForPreview = (
    formData: Partial<BirthCertificateFormValues>
  ): Partial<BirthCertificateFormValues> => {
    if (!formData) return {};

    return {
      ...formData,
      // Transform childInfo - No changes needed here as it's already correct
      childInfo: formData.childInfo && {
        firstName: formData.childInfo.firstName,
        middleName: formData.childInfo.middleName,
        lastName: formData.childInfo.lastName,
        sex: formData.childInfo.sex,
        dateOfBirth: {
          day: formData.childInfo.dateOfBirth.day,
          month: formData.childInfo.dateOfBirth.month,
          year: formData.childInfo.dateOfBirth.year,
        },
        placeOfBirth: {
          hospital: formData.childInfo.placeOfBirth.hospital,
          cityMunicipality: formData.childInfo.placeOfBirth.cityMunicipality,
          province: formData.childInfo.placeOfBirth.province,
        },
        typeOfBirth: formData.childInfo.typeOfBirth,
        birthOrder: formData.childInfo.birthOrder,
        weightAtBirth: formData.childInfo.weightAtBirth,
        multipleBirthOrder: formData.childInfo.multipleBirthOrder,
      },

      // Transform fatherInfo - Update field names to match Prisma model
      fatherInfo: formData.fatherInfo && {
        firstName: formData.fatherInfo.firstName,
        middleName: formData.fatherInfo.middleName,
        lastName: formData.fatherInfo.lastName,
        fatherCitizenship: formData.fatherInfo.fatherCitizenship, // Updated
        fatherReligion: formData.fatherInfo.fatherReligion, // Updated
        fatherOccupation: formData.fatherInfo.fatherOccupation, // Updated
        fatherAge: formData.fatherInfo.fatherAge, // Updated
        residence: {
          address: formData.fatherInfo.residence.address,
          cityMunicipality: formData.fatherInfo.residence.cityMunicipality,
          province: formData.fatherInfo.residence.province,
          country: formData.fatherInfo.residence.country,
        },
      },

      // Transform motherInfo - No changes needed as it's already updated
      motherInfo: formData.motherInfo && {
        firstName: formData.motherInfo.firstName,
        middleName: formData.motherInfo.middleName,
        lastName: formData.motherInfo.lastName,
        motherCitizenship: formData.motherInfo.motherCitizenship,
        motherReligion: formData.motherInfo.motherReligion,
        motherOccupation: formData.motherInfo.motherOccupation,
        motherAge: formData.motherInfo.motherAge,
        totalChildrenBornAlive: formData.motherInfo.totalChildrenBornAlive,
        childrenStillLiving: formData.motherInfo.childrenStillLiving,
        childrenNowDead: formData.motherInfo.childrenNowDead,
        residence: {
          address: formData.motherInfo.residence.address,
          cityMunicipality: formData.motherInfo.residence.cityMunicipality,
          province: formData.motherInfo.residence.province,
          country: formData.motherInfo.residence.country,
        },
      },

      // Transform parentMarriage (renamed from marriageOfParents)
      parentMarriage: formData.parentMarriage && {
        // Updated
        date: {
          day: formData.parentMarriage.date.day, // Updated
          month: formData.parentMarriage.date.month, // Updated
          year: formData.parentMarriage.date.year, // Updated
        },
        place: {
          cityMunicipality: formData.parentMarriage.place.cityMunicipality, // Updated
          province: formData.parentMarriage.place.province, // Updated
          country: formData.parentMarriage.place.country, // Updated
        },
      },

      // The rest remains the same as they're already correct
      attendant: formData.attendant && {
        type: formData.attendant.type,
        certification: {
          time: formData.attendant.certification.time,
          name: formData.attendant.certification.name,
          title: formData.attendant.certification.title,
          address: formData.attendant.certification.address,
          date: formData.attendant.certification.date,
          signature: formData.attendant.certification.signature,
        },
      },

      informant: formData.informant && {
        name: formData.informant.name,
        relationship: formData.informant.relationship,
        address: formData.informant.address,
        date: formData.informant.date,
        signature: formData.informant.signature,
      },

      preparedBy: formData.preparedBy && {
        name: formData.preparedBy.name,
        title: formData.preparedBy.title,
        date: formData.preparedBy.date,
        signature: formData.preparedBy.signature,
      },

      receivedBy: formData.receivedBy && {
        name: formData.receivedBy.name,
        title: formData.receivedBy.title,
        date: formData.receivedBy.date,
        signature: formData.receivedBy.signature,
      },

      registeredByOffice: formData.registeredByOffice && {
        name: formData.registeredByOffice.name,
        title: formData.registeredByOffice.title,
        date: formData.registeredByOffice.date,
        signature: formData.registeredByOffice.signature,
      },
    };
  };

  const handleSubmit = (values: BirthCertificateFormValues) => {
    if (shouldSkipAlert('skipBirthCertificateAlert')) {
      onSubmit(values);
    } else {
      setPendingSubmission(values);
      setShowAlert(true);
    }
  };

  // Add this separate error handler
  const handleError = () => {
    toast.warning('Please fill in all required fields', {
      description: 'Some required information is missing or incorrect.',
    });
  };

  const confirmSubmit = () => {
    if (pendingSubmission) {
      onSubmit(pendingSubmission);
      setShowAlert(false);
      setPendingSubmission(null);
    }
  };

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
            {/* Left Side - Form */}
            <div className='w-1/2 border-r'>
              <ScrollArea className='h-[calc(95vh-120px)]'>
                <div className='p-6'>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleSubmit, handleError)}
                      className='space-y-6'
                    >
                      <RegistryInformationCard />
                      <ChildInformationCard />
                      <MotherInformationCard />
                      <FatherInformationCard />
                      <MarriageOfParentsCard />
                      <AttendantInformationCard />
                      <CertificationOfInformantCard />
                      <PreparedByCard />
                      <ReceivedByCard />
                      <RegisteredAtOfficeCard />
                      <RemarksCard />

                      <DialogFooter>
                        <Button
                          type='button'
                          variant='outline'
                          className='h-10'
                          onClick={onCancel}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          type='submit'
                          className='h-10 ml-2'
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className='mr-2 h-4 w-4' />
                              Save Registration
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>

                  <ConfirmationDialog
                    open={showAlert}
                    onOpenChange={setShowAlert}
                    onConfirm={confirmSubmit}
                    isSubmitting={isSubmitting}
                    localStorageKey='skipBirthCertificateAlert'
                    // Optionally override default texts
                    // title="Custom Title"
                    // description="Custom Description"
                    // confirmButtonText="Custom Confirm Text"
                    // cancelButtonText="Custom Cancel Text"
                  />
                </div>
              </ScrollArea>
            </div>

            {/* Right Side - Preview */}
            <div className='w-1/2'>
              <div className='h-[calc(95vh-120px)] p-6'>
                <PDFViewer width='100%' height='100%'>
                  <BirthCertificatePDF
                    data={transformFormDataForPreview(form.watch())}
                  />
                </PDFViewer>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
