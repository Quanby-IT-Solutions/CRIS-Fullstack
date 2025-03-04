// ----------- ORIGINAL --------------------//

import { submitDeathCertificateForm } from '@/components/custom/civil-registry/actions/certificate-actions/death-certificate-actions';
import {
  DeathCertificateFormValues,
  deathCertificateFormSchema,
} from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { fileToBase64 } from '@/lib/utils/fileToBase64';
import { zodResolver } from '@hookform/resolvers/zod';
import { Permission } from '@prisma/client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { notifyUsersWithPermission } from '../users-action';

export interface UseDeathCertificateFormProps {
  onOpenChange?: (open: boolean) => void;
  defaultValues?: Partial<DeathCertificateFormValues> & { id?: string };
}

const emptyDefaults: DeathCertificateFormValues = {
  registryNumber: '',
  province: '',
  cityMunicipality: '',
  name: {
    first: '',
    middle: '',
    last: '',
  },
  sex: undefined,
  dateOfDeath: undefined,
  timeOfDeath: undefined,
  dateOfBirth: undefined,
  ageAtDeath: {
    years: '',
    months: '',
    days: '',
    hours: '',
  },
  placeOfDeath: {
    hospitalInstitution: '',
    houseNo: '',
    st: '',
    barangay: '',
    cityMunicipality: '',
    province: '',
  },
  civilStatus: undefined,
  religion: '',
  citizenship: '',
  residence: {
    houseNo: '',
    st: '',
    barangay: '',
    cityMunicipality: '',
    province: '',
    country: '',
  },
  occupation: '',
  birthInformation: {
    ageOfMother: '',
    methodOfDelivery: 'Normal spontaneous vertex',
    lengthOfPregnancy: undefined,
    typeOfBirth: 'Single',
    birthOrder: undefined,
  },
  parents: {
    fatherName: {
      first: '',
      middle: '',
      last: '',
    },
    motherName: {
      first: '',
      middle: '',
      last: '',
    },
  },
  causesOfDeath19b: {
    immediate: { cause: '', interval: '' },
    antecedent: { cause: '', interval: '' },
    underlying: { cause: '', interval: '' },
    otherSignificantConditions: '',
  },
  medicalCertificate: {
    causesOfDeath: {
      immediate: { cause: '', interval: '' },
      antecedent: { cause: '', interval: '' },
      underlying: { cause: '', interval: '' },
      otherSignificantConditions: '',
    },
    maternalCondition: {
      pregnantNotInLabor: false,
      pregnantInLabor: false,
      lessThan42Days: false,
      daysTo1Year: false,
      noneOfTheAbove: false,
    },
    externalCauses: { mannerOfDeath: '', placeOfOccurrence: '' },
    attendant: {
      type: undefined,
      othersSpecify: '',
      duration: undefined,
      certification: undefined,
    },
    autopsy: false,
  },
  certificationOfDeath: {
    hasAttended: false,
    signature: '',
    nameInPrint: '',
    titleOfPosition: '',
    address: {
      houseNo: '',
      st: '',
      barangay: '',
      cityMunicipality: '',
      province: '',
      country: '',
    },
    date: undefined,
    healthOfficerSignature: '',
    healthOfficerNameInPrint: '',
  },
  reviewedBy: { signature: '', date: undefined },
  postmortemCertificate: undefined,
  embalmerCertification: undefined,
  delayedRegistration: undefined,
  corpseDisposal: '',
  burialPermit: { number: '', dateIssued: undefined },
  transferPermit: undefined,
  cemeteryOrCrematory: {
    name: '',
    address: {
      houseNo: '',
      st: '',
      barangay: '',
      cityMunicipality: '',
      province: '',
      country: '',
    },
  },
  informant: {
    signature: '',
    nameInPrint: '',
    relationshipToDeceased: '',
    address: {
      houseNo: '',
      st: '',
      barangay: '',
      cityMunicipality: '',
      province: '',
      country: '',
    },
    date: undefined,
  },
  preparedBy: {
    signature: '',
    nameInPrint: '',
    titleOrPosition: '',
    date: undefined,
  },
  receivedBy: {
    signature: '',
    nameInPrint: '',
    titleOrPosition: '',
    date: undefined,
  },
  registeredByOffice: {
    signature: '',
    nameInPrint: '',
    titleOrPosition: '',
    date: undefined,
  },
  remarks: '',
  pagination: { pageNumber: '', bookNumber: '' },
};

export function useDeathCertificateForm({
  onOpenChange,
  defaultValues,
}: UseDeathCertificateFormProps = {}) {
  const formMethods = useForm<DeathCertificateFormValues>({
    resolver: zodResolver(deathCertificateFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: defaultValues || emptyDefaults,
  });

  // Only reset the form if defaultValues change and the form is not dirty.
  useEffect(() => {
    if (defaultValues && !formMethods.formState.isDirty) {
      formMethods.reset({ ...emptyDefaults, ...defaultValues });
    }
  }, [defaultValues, formMethods]);

  const onSubmit = async (data: DeathCertificateFormValues) => {
    try {
      console.log(
        'Attempting to submit form with data:',
        JSON.stringify(data, null, 2)
      );

      // Convert signature fields to Base64 if needed
      if (
        data.medicalCertificate?.attendant?.certification?.signature instanceof
        File
      ) {
        data.medicalCertificate.attendant.certification.signature =
          await fileToBase64(
            data.medicalCertificate.attendant.certification.signature
          );
      }
      if (data.certificationOfDeath.signature instanceof File) {
        data.certificationOfDeath.signature = await fileToBase64(
          data.certificationOfDeath.signature
        );
      }
      if (data.certificationOfDeath.healthOfficerSignature instanceof File) {
        data.certificationOfDeath.healthOfficerSignature = await fileToBase64(
          data.certificationOfDeath.healthOfficerSignature
        );
      }
      if (data.reviewedBy.signature instanceof File) {
        data.reviewedBy.signature = await fileToBase64(
          data.reviewedBy.signature
        );
      }
      if (data.informant.signature instanceof File) {
        data.informant.signature = await fileToBase64(data.informant.signature);
      }
      if (data.preparedBy.signature instanceof File) {
        data.preparedBy.signature = await fileToBase64(
          data.preparedBy.signature
        );
      }
      if (data.receivedBy.signature instanceof File) {
        data.receivedBy.signature = await fileToBase64(
          data.receivedBy.signature
        );
      }
      if (data.registeredByOffice.signature instanceof File) {
        data.registeredByOffice.signature = await fileToBase64(
          data.registeredByOffice.signature
        );
      }
      if (data.postmortemCertificate?.signature instanceof File) {
        data.postmortemCertificate.signature = await fileToBase64(
          data.postmortemCertificate.signature
        );
      }
      if (data.embalmerCertification?.signature instanceof File) {
        data.embalmerCertification.signature = await fileToBase64(
          data.embalmerCertification.signature
        );
      }
      if (data.delayedRegistration?.affiant?.signature instanceof File) {
        data.delayedRegistration.affiant.signature = await fileToBase64(
          data.delayedRegistration.affiant.signature
        );
      }
      if (data.delayedRegistration?.adminOfficer?.signature instanceof File) {
        data.delayedRegistration.adminOfficer.signature = await fileToBase64(
          data.delayedRegistration.adminOfficer.signature
        );
      }

      // If defaultValues includes an id, assume update mode and log success.
      if (defaultValues && defaultValues.id) {
        console.log('Update successful:', data);
        toast.success('Death certificate update successful');
      } else {
        const result = await submitDeathCertificateForm(data);
        console.log('API submission result:', result);
        if ('data' in result) {
          console.log('Submission successful:', result);
          toast.success(
            `Death certificate submitted successfully (Book ${result.data.bookNumber}, Page ${result.data.pageNumber})`
          );

          const documentRead = Permission.DOCUMENT_READ;
          const Title = 'New uploaded Death Certificate';
          const message = `New Death Certificate with the details (Book ${result.data.bookNumber}, Page ${result.data.pageNumber}, Registry Number ${data.registryNumber}) has been uploaded.`;
          notifyUsersWithPermission(documentRead, Title, message);

          onOpenChange?.(false);
        } else if ('error' in result) {
          console.log('Submission error:', result.error);
          const errorMessage = result.error.includes('No user found with name')
            ? 'Invalid prepared by user. Please check the name.'
            : result.error;
          toast.error(errorMessage);
        }
      }
      formMethods.reset(emptyDefaults);
    } catch (error) {
      console.error('Form submission error details:', error);
      toast.error('An unexpected error occurred while submitting the form');
    }
  };

  const handleError = (errors: any) => {
    console.log('Form Validation Errors Object:', errors);
    const logNestedErrors = (obj: any, path: string = '') => {
      if (!obj) return;
      if (typeof obj === 'object') {
        if (obj.message) {
          console.log(`${path}: ${obj.message}`);
        }
        Object.keys(obj).forEach((key) => {
          logNestedErrors(obj[key], path ? `${path}.${key}` : key);
        });
      }
    };
    logNestedErrors(errors);
    console.log(
      'All validation errors as JSON:',
      JSON.stringify(errors, null, 2)
    );
    toast.error('Please check form for errors');
  };

  return { formMethods, onSubmit, handleError };
}

// -------------------------- submission data for testing --------------------//
// import { submitDeathCertificateForm } from '@/components/custom/civil-registry/actions/certificate-actions/death-certificate-actions';
// import {
//   DeathCertificateFormValues,
//   deathCertificateFormSchema,
// } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
// import { fileToBase64 } from '@/lib/utils/fileToBase64';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Permission } from '@prisma/client';
// import { useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { toast } from 'sonner';
// import { notifyUsersWithPermission } from '../users-action';

// export interface UseDeathCertificateFormProps {
//   onOpenChange?: (open: boolean) => void;
//   defaultValues?: Partial<DeathCertificateFormValues> & { id?: string };
// }

// const emptyDefaults: DeathCertificateFormValues = {
//   registryNumber: '2025-1001',
//   province: 'Province A',
//   cityMunicipality: 'City A',
//   name: {
//     first: 'John',
//     middle: 'Q',
//     last: 'Public',
//   },
//   sex: 'Male',
//   dateOfDeath: new Date('2025-03-03'),
//   timeOfDeath: undefined, // a valid string that will be preprocessed into a Date
//   dateOfBirth: new Date('1950-01-01'),
//   ageAtDeath: {
//     years: '75',
//     months: '0',
//     days: '0',
//     hours: '0',
//   },
//   placeOfDeath: {
//     hospitalInstitution: 'General Hospital',
//     houseNo: '123',
//     st: 'Main St',
//     barangay: 'Barangay 1',
//     cityMunicipality: 'City A',
//     province: 'Province A',
//   },
//   civilStatus: 'Married',
//   religion: 'Christianity',
//   citizenship: 'American',
//   residence: {
//     houseNo: '456',
//     st: 'Second St',
//     barangay: 'Barangay 2',
//     cityMunicipality: 'City B',
//     province: 'Province B',
//     country: 'USA',
//   },
//   occupation: 'Retired',
//   birthInformation: {
//     ageOfMother: '30',
//     methodOfDelivery: 'Normal spontaneous vertex',
//     lengthOfPregnancy: 38,
//     typeOfBirth: 'Single',
//     birthOrder: 'First',
//   },
//   parents: {
//     fatherName: {
//       first: 'Michael',
//       middle: 'J',
//       last: 'Smith',
//     },
//     motherName: {
//       first: 'Sarah',
//       middle: 'L',
//       last: 'Smith',
//     },
//   },
//   causesOfDeath19b: {
//     immediate: { cause: 'Cardiac arrest', interval: '2 hours' },
//     antecedent: { cause: 'Heart disease', interval: '3 days' },
//     underlying: { cause: 'Hypertension', interval: 'Unknown' },
//     otherSignificantConditions: 'None',
//   },
//   medicalCertificate: {
//     causesOfDeath: {
//       immediate: { cause: 'Cardiac arrest', interval: '2 hours' },
//       antecedent: { cause: 'Heart disease', interval: '3 days' },
//       underlying: { cause: 'Hypertension', interval: 'Unknown' },
//       otherSignificantConditions: 'None',
//     },
//     maternalCondition: {
//       pregnantNotInLabor: false,
//       pregnantInLabor: false,
//       lessThan42Days: false,
//       daysTo1Year: false,
//       noneOfTheAbove: false,
//     },
//     externalCauses: { mannerOfDeath: 'Natural', placeOfOccurrence: 'Home' },
//     attendant: {
//       type: 'Private physician',
//       othersSpecify: '',
//       duration: {
//         from: new Date('2025-03-03T08:00:00'),
//         to: new Date('2025-03-03T10:00:00'),
//       },
//       certification: {
//         time: new Date('2025-03-03T11:00:00'),
//         signature: 'base64attendantcertsignature',
//         name: 'Dr. House',
//         title: 'Attending Physician',
//         address: {
//           houseNo: '789',
//           st: 'Third St',
//           barangay: 'Barangay 3',
//           cityMunicipality: 'City C',
//           province: 'Province C',
//           country: 'USA',
//         },
//         date: new Date('2025-03-03'),
//       },
//     },
//     autopsy: false,
//   },
//   certificationOfDeath: {
//     hasAttended: true,
//     signature: 'base64certsignature',
//     nameInPrint: 'Dr. Who',
//     titleOfPosition: 'Medical Examiner',
//     address: {
//       houseNo: '101',
//       st: 'Fourth St',
//       barangay: 'Barangay 4',
//       cityMunicipality: 'City D',
//       province: 'Province D',
//       country: 'USA',
//     },
//     date: new Date('2025-03-03'),
//     healthOfficerSignature: 'base64healthsignature',
//     healthOfficerNameInPrint: 'Nurse Joy',
//   },
//   reviewedBy: { signature: 'base64review', date: new Date('2025-03-03') },
//   postmortemCertificate: undefined,
//   embalmerCertification: undefined,
//   delayedRegistration: undefined,
//   corpseDisposal: 'Burial',
//   burialPermit: { number: 'BP-001', dateIssued: new Date('2025-03-03') },
//   transferPermit: undefined,
//   cemeteryOrCrematory: {
//     name: 'Cemetery A',
//     address: {
//       houseNo: '111',
//       st: 'Fifth St',
//       barangay: 'Barangay 5',
//       cityMunicipality: 'City A', // same as placeOfDeath to avoid transfer permit error
//       province: 'Province A',
//       country: 'USA',
//     },
//   },
//   informant: {
//     signature: 'base64informant',
//     nameInPrint: 'Jane Doe',
//     relationshipToDeceased: 'Daughter',
//     address: {
//       houseNo: '222',
//       st: 'Sixth St',
//       barangay: 'Barangay 6',
//       cityMunicipality: 'City B',
//       province: 'Province B',
//       country: 'USA',
//     },
//     date: new Date('2025-03-03'),
//   },
//   preparedBy: {
//     signature: 'base64prepared',
//     nameInPrint: 'Alice',
//     titleOrPosition: 'Registrar',
//     date: new Date('2025-03-03'),
//   },
//   receivedBy: {
//     signature: 'base64received',
//     nameInPrint: 'Bob',
//     titleOrPosition: 'Clerk',
//     date: new Date('2025-03-03'),
//   },
//   registeredByOffice: {
//     signature: 'base64registered',
//     nameInPrint: 'Charlie',
//     titleOrPosition: 'Supervisor',
//     date: new Date('2025-03-03'),
//   },
//   remarks: 'Test submission',
//   pagination: { pageNumber: '1', bookNumber: '1' },
// };

// export function useDeathCertificateForm({
//   onOpenChange,
//   defaultValues,
// }: UseDeathCertificateFormProps = {}) {
//   const formMethods = useForm<DeathCertificateFormValues>({
//     resolver: zodResolver(deathCertificateFormSchema),
//     mode: 'onChange',
//     reValidateMode: 'onChange',
//     defaultValues: defaultValues || emptyDefaults,
//   });

//   // Only reset the form if defaultValues change and the form is not dirty.
//   useEffect(() => {
//     if (defaultValues && !formMethods.formState.isDirty) {
//       formMethods.reset({ ...emptyDefaults, ...defaultValues });
//     }
//   }, [defaultValues, formMethods]);

//   const onSubmit = async (data: DeathCertificateFormValues) => {
//     try {
//       console.log(
//         'Attempting to submit form with data:',
//         JSON.stringify(data, null, 2)
//       );

//       // Convert signature fields to Base64 if needed
//       if (
//         data.medicalCertificate?.attendant?.certification?.signature instanceof
//         File
//       ) {
//         data.medicalCertificate.attendant.certification.signature =
//           await fileToBase64(
//             data.medicalCertificate.attendant.certification.signature
//           );
//       }
//       if (data.certificationOfDeath.signature instanceof File) {
//         data.certificationOfDeath.signature = await fileToBase64(
//           data.certificationOfDeath.signature
//         );
//       }
//       if (data.certificationOfDeath.healthOfficerSignature instanceof File) {
//         data.certificationOfDeath.healthOfficerSignature = await fileToBase64(
//           data.certificationOfDeath.healthOfficerSignature
//         );
//       }
//       if (data.reviewedBy.signature instanceof File) {
//         data.reviewedBy.signature = await fileToBase64(
//           data.reviewedBy.signature
//         );
//       }
//       if (data.informant.signature instanceof File) {
//         data.informant.signature = await fileToBase64(data.informant.signature);
//       }
//       if (data.preparedBy.signature instanceof File) {
//         data.preparedBy.signature = await fileToBase64(
//           data.preparedBy.signature
//         );
//       }
//       if (data.receivedBy.signature instanceof File) {
//         data.receivedBy.signature = await fileToBase64(
//           data.receivedBy.signature
//         );
//       }
//       if (data.registeredByOffice.signature instanceof File) {
//         data.registeredByOffice.signature = await fileToBase64(
//           data.registeredByOffice.signature
//         );
//       }
//       if (data.postmortemCertificate?.signature instanceof File) {
//         data.postmortemCertificate.signature = await fileToBase64(
//           data.postmortemCertificate.signature
//         );
//       }
//       if (data.embalmerCertification?.signature instanceof File) {
//         data.embalmerCertification.signature = await fileToBase64(
//           data.embalmerCertification.signature
//         );
//       }
//       if (data.delayedRegistration?.affiant?.signature instanceof File) {
//         data.delayedRegistration.affiant.signature = await fileToBase64(
//           data.delayedRegistration.affiant.signature
//         );
//       }
//       if (data.delayedRegistration?.adminOfficer?.signature instanceof File) {
//         data.delayedRegistration.adminOfficer.signature = await fileToBase64(
//           data.delayedRegistration.adminOfficer.signature
//         );
//       }

//       // If defaultValues includes an id, assume update mode and log success.
//       if (defaultValues && defaultValues.id) {
//         console.log('Update successful:', data);
//         toast.success('Death certificate update successful');
//       } else {
//         const result = await submitDeathCertificateForm(data);
//         console.log('API submission result:', result);
//         if ('data' in result) {
//           console.log('Submission successful:', result);
//           toast.success(
//             `Death certificate submitted successfully (Book ${result.data.bookNumber}, Page ${result.data.pageNumber})`
//           );

//           const documentRead = Permission.DOCUMENT_READ;
//           const Title = 'New uploaded Death Certificate';
//           const message = `New Death Certificate with the details (Book ${result.data.bookNumber}, Page ${result.data.pageNumber}, Registry Number ${data.registryNumber}) has been uploaded.`;
//           notifyUsersWithPermission(documentRead, Title, message);

//           onOpenChange?.(false);
//         } else if ('error' in result) {
//           console.log('Submission error:', result.error);
//           const errorMessage = result.error.includes('No user found with name')
//             ? 'Invalid prepared by user. Please check the name.'
//             : result.error;
//           toast.error(errorMessage);
//         }
//       }
//       formMethods.reset(emptyDefaults);
//     } catch (error) {
//       console.error('Form submission error details:', error);
//       toast.error('An unexpected error occurred while submitting the form');
//     }
//   };

//   const handleError = (errors: any) => {
//     console.log('Form Validation Errors Object:', errors);
//     const logNestedErrors = (obj: any, path: string = '') => {
//       if (!obj) return;
//       if (typeof obj === 'object') {
//         if (obj.message) {
//           console.log(`${path}: ${obj.message}`);
//         }
//         Object.keys(obj).forEach((key) => {
//           logNestedErrors(obj[key], path ? `${path}.${key}` : key);
//         });
//       }
//     };
//     logNestedErrors(errors);
//     console.log(
//       'All validation errors as JSON:',
//       JSON.stringify(errors, null, 2)
//     );
//     toast.error('Please check form for errors');
//   };

//   return { formMethods, onSubmit, handleError };
// }
