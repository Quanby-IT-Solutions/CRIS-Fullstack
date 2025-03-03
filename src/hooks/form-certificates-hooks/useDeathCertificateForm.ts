// import { submitDeathCertificateForm } from '@/components/custom/civil-registry/actions/certificate-actions/death-certificate-actions';
// import {
//   DeathCertificateFormValues,
//   deathCertificateFormSchema,
// } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
// import { fileToBase64 } from '@/lib/utils/fileToBase64';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Permission } from '@prisma/client';
// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { toast } from 'sonner';
// import { notifyUsersWithPermission } from '../users-action';

// export interface UseDeathCertificateFormProps {
//   onOpenChange?: (open: boolean) => void;
//   defaultValues?: Partial<DeathCertificateFormValues> & { id?: string };
// }

// const emptyDefaults: DeathCertificateFormValues = {
//   registryNumber: '',
//   province: '',
//   cityMunicipality: '',
//   name: {
//     first: '',
//     middle: '',
//     last: '',
//   },
//   sex: undefined,
//   dateOfDeath: undefined,
//   timeOfDeath: undefined,
//   dateOfBirth: undefined,
//   ageAtDeath: {
//     years: '',
//     months: '',
//     days: '',
//     hours: '',
//   },
//   placeOfDeath: {
//     hospitalInstitution: '',
//     houseNo: '',
//     st: '',
//     barangay: '',
//     cityMunicipality: '',
//     province: '',
//   },
//   civilStatus: undefined,
//   religion: '',
//   citizenship: '',
//   residence: {
//     houseNo: '',
//     st: '',
//     barangay: '',
//     cityMunicipality: '',
//     province: '',
//     country: '',
//   },
//   occupation: '',
//   birthInformation: {
//     ageOfMother: '',
//     methodOfDelivery: 'Normal spontaneous vertex',
//     lengthOfPregnancy: undefined,
//     typeOfBirth: 'Single',
//     birthOrder: undefined,
//   },
//   parents: {
//     fatherName: {
//       first: '',
//       middle: '',
//       last: '',
//     },
//     motherName: {
//       first: '',
//       middle: '',
//       last: '',
//     },
//   },
//   causesOfDeath19b: {
//     immediate: { cause: '', interval: '' },
//     antecedent: { cause: '', interval: '' },
//     underlying: { cause: '', interval: '' },
//     otherSignificantConditions: '',
//   },
//   medicalCertificate: {
//     causesOfDeath: {
//       immediate: { cause: '', interval: '' },
//       antecedent: { cause: '', interval: '' },
//       underlying: { cause: '', interval: '' },
//       otherSignificantConditions: '',
//     },
//     maternalCondition: {
//       pregnantNotInLabor: false,
//       pregnantInLabor: false,
//       lessThan42Days: false,
//       daysTo1Year: false,
//       noneOfTheAbove: false,
//     },
//     externalCauses: { mannerOfDeath: '', placeOfOccurrence: '' },
//     attendant: {
//       type: undefined,
//       othersSpecify: '',
//       duration: undefined,
//       certification: undefined,
//     },
//     autopsy: false,
//   },
//   certificationOfDeath: {
//     hasAttended: false,
//     signature: '',
//     nameInPrint: '',
//     titleOfPosition: '',
//     address: {
//       houseNo: '',
//       st: '',
//       barangay: '',
//       cityMunicipality: '',
//       province: '',
//       country: '',
//     },
//     date: undefined,
//     healthOfficerSignature: '',
//     healthOfficerNameInPrint: '',
//   },
//   reviewedBy: { signature: '', date: undefined },
//   postmortemCertificate: undefined,
//   embalmerCertification: undefined,
//   delayedRegistration: undefined,
//   corpseDisposal: '',
//   burialPermit: { number: '', dateIssued: undefined },
//   transferPermit: undefined,
//   cemeteryOrCrematory: {
//     name: '',
//     address: {
//       houseNo: '',
//       st: '',
//       barangay: '',
//       cityMunicipality: '',
//       province: '',
//       country: '',
//     },
//   },
//   informant: {
//     signature: '',
//     nameInPrint: '',
//     relationshipToDeceased: '',
//     address: {
//       houseNo: '',
//       st: '',
//       barangay: '',
//       cityMunicipality: '',
//       province: '',
//       country: '',
//     },
//     date: undefined,
//   },
//   preparedBy: {
//     signature: '',
//     nameInPrint: '',
//     titleOrPosition: '',
//     date: undefined,
//   },
//   receivedBy: {
//     signature: '',
//     nameInPrint: '',
//     titleOrPosition: '',
//     date: undefined,
//   },
//   registeredByOffice: {
//     signature: '',
//     nameInPrint: '',
//     titleOrPosition: '',
//     date: undefined,
//   },
//   remarks: '',
//   pagination: { pageNumber: '', bookNumber: '' },
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

//   // Reset the form when defaultValues change (for edit mode)
//   React.useEffect(() => {
//     if (defaultValues) {
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

//       // If defaultValues includes an id, assume update mode and simply log success
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

//              const documentRead = Permission.DOCUMENT_READ
//                   const Title = "New uploaded Death Certificate"
//                   const message = `New Death Certificate with the details (Book ${result.data.bookNumber}, Page ${result.data.pageNumber}, Registry Number ${data.registryNumber}) has been uploaded.`
//                   notifyUsersWithPermission(documentRead, Title, message)

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

import { submitDeathCertificateForm } from '@/components/custom/civil-registry/actions/certificate-actions/death-certificate-actions';
import {
  DeathCertificateFormValues,
  deathCertificateFormSchema,
} from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { fileToBase64 } from '@/lib/utils/fileToBase64';
import { zodResolver } from '@hookform/resolvers/zod';
import { Permission } from '@prisma/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { notifyUsersWithPermission } from '../users-action';

export interface UseDeathCertificateFormProps {
  onOpenChange?: (open: boolean) => void;
  defaultValues?: Partial<DeathCertificateFormValues> & { id?: string };
}

const dummyDefaults: DeathCertificateFormValues = {
  registryNumber: '2022-12345',
  province: 'Sample Province',
  cityMunicipality: 'Sample City',
  name: {
    first: 'John',
    middle: 'M',
    last: 'Doe',
  },
  sex: 'Male',
  dateOfDeath: new Date('2023-01-01T00:00:00'),
  timeOfDeath: new Date('2023-01-01T12:34:00'),
  dateOfBirth: new Date('2022-12-31T00:00:00'),
  // Updated days to "10" so that infant-specific validation is not triggered.
  ageAtDeath: {
    years: '0',
    months: '0',
    days: '10',
    hours: '12',
  },
  placeOfDeath: {
    hospitalInstitution: 'Sample Hospital',
    houseNo: '123',
    st: 'Main St',
    barangay: 'Barangay 1',
    cityMunicipality: 'Sample City',
    province: 'Sample Province',
  },
  civilStatus: 'Single',
  religion: 'Christianity',
  citizenship: 'Sample Country',
  residence: {
    houseNo: '123',
    st: 'Main St',
    barangay: 'Barangay 1',
    cityMunicipality: 'Sample City',
    province: 'Sample Province',
    country: 'Sample Country',
  },
  occupation: 'Unemployed',
  birthInformation: {
    ageOfMother: '30',
    methodOfDelivery: 'Normal spontaneous vertex',
    lengthOfPregnancy: 38,
    typeOfBirth: 'Single',
    birthOrder: 'First',
  },
  parents: {
    fatherName: { first: 'Robert', middle: 'A', last: 'Doe' },
    motherName: { first: 'Jane', middle: 'B', last: 'Doe' },
  },
  causesOfDeath19b: {
    immediate: { cause: 'Cardiac arrest', interval: '5 minutes' },
    antecedent: { cause: 'Heart disease', interval: '2 years' },
    underlying: { cause: 'Hypertension', interval: '10 years' },
    otherSignificantConditions: 'None',
  },
  medicalCertificate: {
    causesOfDeath: {
      immediate: { cause: 'Cardiac arrest', interval: '5 minutes' },
      antecedent: { cause: 'Heart disease', interval: '2 years' },
      underlying: { cause: 'Hypertension', interval: '10 years' },
      otherSignificantConditions: 'None',
    },
    maternalCondition: {
      pregnantNotInLabor: false,
      pregnantInLabor: false,
      lessThan42Days: false,
      daysTo1Year: false,
      noneOfTheAbove: true,
    },
    externalCauses: { mannerOfDeath: 'Natural', placeOfOccurrence: 'Hospital' },
    attendant: {
      type: 'Private physician',
      othersSpecify: '',
      duration: {
        from: new Date('2023-01-01T10:00:00'),
        to: new Date('2023-01-01T12:00:00'),
      },
      certification: {
        time: new Date('2023-01-01T12:00:00'),
        signature: 'base64dummySignature1',
        name: 'Dr. Smith',
        title: 'Attending Physician',
        address: {
          houseNo: '456',
          st: 'Doctor St',
          barangay: 'Barangay 2',
          cityMunicipality: 'Sample City',
          province: 'Sample Province',
          country: 'Sample Country',
        },
        date: new Date('2023-01-01'),
      },
    },
    autopsy: false,
  },
  certificationOfDeath: {
    hasAttended: true,
    signature: 'base64dummySignature2',
    nameInPrint: 'Officer Name',
    titleOfPosition: 'Health Officer',
    address: {
      houseNo: '789',
      st: 'Officer St',
      barangay: 'Barangay 3',
      cityMunicipality: 'Sample City',
      province: 'Sample Province',
      country: 'Sample Country',
    },
    date: new Date('2023-01-02'),
    healthOfficerSignature: 'base64dummySignature3',
    healthOfficerNameInPrint: 'Health Officer Name',
  },
  reviewedBy: {
    signature: 'base64dummySignature4',
    date: new Date('2023-01-03'),
  },
  postmortemCertificate: {
    causeOfDeath: 'Natural',
    signature: 'base64dummySignature5',
    nameInPrint: 'Postmortem Name',
    date: new Date('2023-01-04'),
    titleDesignation: 'Postmortem Title',
    address: '123 Postmortem Address',
  },
  embalmerCertification: {
    nameOfDeceased: 'John Doe',
    signature: 'base64dummySignature6',
    nameInPrint: 'Embalmer Name',
    address: '123 Embalmer Address',
    titleDesignation: 'Embalmer Title',
    licenseNo: '123456',
    issuedOn: '2023-01-05',
    issuedAt: 'Sample City',
    expiryDate: '2025-01-05',
  },
  delayedRegistration: {
    affiant: {
      name: 'Affiant Name',
      civilStatus: 'Married',
      residenceAddress: '123 Affiant Address',
      age: '40',
      signature: 'base64dummySignature7',
    },
    deceased: {
      name: 'John Doe',
      dateOfDeath: '2023-01-01',
      placeOfDeath: 'Sample Hospital',
      burialInfo: {
        date: '2023-01-06',
        place: 'Cemetery',
        method: 'Buried',
      },
    },
    attendance: {
      wasAttended: true,
      attendedBy: 'Attendant Name',
    },
    causeOfDeath: 'Natural',
    reasonForDelay: 'Some reason',
    affidavitDate: new Date('2023-01-07'),
    affidavitDatePlace: 'Sample City',
    adminOfficer: {
      signature: 'base64dummySignature8',
      position: 'Admin Officer',
    },
    ctcInfo: {
      number: 'CTC123',
      issuedOn: '2023-01-08',
      issuedAt: 'Sample City',
    },
  },
  corpseDisposal: 'Cremation',
  burialPermit: {
    number: 'BP123',
    dateIssued: new Date('2023-01-09'),
  },
  transferPermit: {
    number: 'TP123',
    dateIssued: '2023-01-10',
  },
  cemeteryOrCrematory: {
    name: 'Cemetery Name',
    address: {
      houseNo: '321',
      st: 'Cemetery St',
      barangay: 'Barangay 4',
      cityMunicipality: 'Sample City',
      province: 'Sample Province',
      country: 'Sample Country',
    },
  },
  informant: {
    signature: 'base64dummySignature9',
    nameInPrint: 'Informant Name',
    relationshipToDeceased: 'Brother',
    address: {
      houseNo: '111',
      st: 'Informant St',
      barangay: 'Barangay 5',
      cityMunicipality: 'Sample City',
      province: 'Sample Province',
      country: 'Sample Country',
    },
    date: new Date('2023-01-11'),
  },
  preparedBy: {
    signature: 'base64dummySignature10',
    nameInPrint: 'Preparer Name',
    titleOrPosition: 'Registrar',
    date: new Date('2023-01-12'),
  },
  receivedBy: {
    signature: 'base64dummySignature11',
    nameInPrint: 'Receiver Name',
    titleOrPosition: 'Receiver',
    date: new Date('2023-01-13'),
  },
  registeredByOffice: {
    signature: 'base64dummySignature12',
    nameInPrint: 'Registrar Office Name',
    titleOrPosition: 'Registrar',
    date: new Date('2023-01-14'),
  },
  remarks: 'No remarks',
  pagination: { pageNumber: '1', bookNumber: '1' },
};

export function useDeathCertificateForm({
  onOpenChange,
  defaultValues,
}: UseDeathCertificateFormProps = {}) {
  const formMethods = useForm<DeathCertificateFormValues>({
    resolver: zodResolver(deathCertificateFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: defaultValues || dummyDefaults,
  });

  // Reset the form when defaultValues change (for edit mode)
  React.useEffect(() => {
    if (defaultValues) {
      formMethods.reset({ ...dummyDefaults, ...defaultValues });
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

      // If defaultValues includes an id, assume update mode and simply log success
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
      formMethods.reset(dummyDefaults);
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
