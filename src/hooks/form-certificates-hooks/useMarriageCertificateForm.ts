import { submitMarriageCertificateForm } from '@/components/custom/civil-registry/actions/certificate-actions/marriage-certificate-actions';
import { MarriageCertificateFormValues, marriageCertificateSchema } from '@/lib/types/zod-form-certificate/marriage-certificate-form-schema';
import { fileToBase64 } from '@/lib/utils/fileToBase64';
import { zodResolver } from '@hookform/resolvers/zod';
import { Permission } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { notifyUsersWithPermission } from '../users-action';
import { useRouter } from 'next/navigation';
import { updateMarriageCertificateForm } from '@/components/custom/civil-registry/actions/certificate-edit-actions/marriage-edit-certificate-actions';

interface UseMarriageCertificateFormProps {
    onOpenChange?: (open: boolean) => void;
    baseFormId?: string; // Add this field
    defaultValues?: Partial<MarriageCertificateFormValues> & { id?: string };
}

// Helper function to prepare data for Prisma
const preparePrismaData = (data: any) => {
    const formatTimeString = (date: Date) => {
        return date instanceof Date ?
            date.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            }) : date;
    };
    const processedData = { ...data };
    return processedData;
};

const emptyDefaults: MarriageCertificateFormValues = {
    // Registry Information
    registryNumber: '',
    province: '',
    cityMunicipality: '',
  
    // Husband Information
    husbandName: {
      first: '',
      middle: '',
      last: '',
    },
    husbandAge: 0,
    husbandBirth: undefined, // or new Date() if you want an empty date
    husbandPlaceOfBirth: {
      houseNo: '',
      street: '',
      barangay: '',
      cityMunicipality: '',
      province: '',
      country: '',
    },
    husbandSex: '' as 'Male' | 'Female', // Cast to satisfy TypeScript
    husbandCitizenship: '',
    husbandResidence: '',
    husbandReligion: '',
    husbandCivilStatus: '' as 'Single' | 'Widowed' | 'Divorced', // Cast to satisfy TypeScript
    husbandConsentPerson: {
      name: {
        first: '',
        middle: '',
        last: '',
      },
      relationship: '',
      residence: {
        houseNo: '',
        street: '',
        barangay: '',
        cityMunicipality: '',
        province: '',
        country: '',
      },
    },
    husbandParents: {
      fatherName: {
        first: '',
        middle: '',
        last: '',
      },
      fatherCitizenship: '',
      motherName: {
        first: '',
        middle: '',
        last: '',
      },
      motherCitizenship: '',
    },
  
    // Wife Information
    wifeName: {
      first: '',
      middle: '',
      last: '',
    },
    wifeAge: 0,
    wifeBirth: undefined, // or new Date() if you want an empty date
    wifePlaceOfBirth: {
      houseNo: '',
      street: '',
      barangay: '',
      cityMunicipality: '',
      province: '',
      country: '',
    },
    wifeSex: '' as 'Female', // Cast to satisfy TypeScript
    wifeCitizenship: '',
    wifeResidence: '',
    wifeReligion: '',
    wifeCivilStatus: '' as 'Single' | 'Widowed' | 'Divorced', // Cast to satisfy TypeScript
    wifeConsentPerson: {
      name: {
        first: '',
        middle: '',
        last: '',
      },
      relationship: '',
      residence: {
        houseNo: '',
        street: '',
        barangay: '',
        cityMunicipality: '',
        province: '',
        country: '',
      },
    },
    wifeParents: {
      fatherName: {
        first: '',
        middle: '',
        last: '',
      },
      fatherCitizenship: '',
      motherName: {
        first: '',
        middle: '',
        last: '',
      },
      motherCitizenship: '',
    },
  
    // Marriage Details
    placeOfMarriage: {
      houseNo: '',
      street: '',
      barangay: '',
      cityMunicipality: '',
      province: '',
      country: '',
    },
    dateOfMarriage: undefined, // or new Date() if you want an empty date
    timeOfMarriage: undefined, // or new Date() if you want an empty date
  
    // Witnesses
    husbandWitnesses: [],
    wifeWitnesses: [],
  
    // Contract Details
    contractDay: undefined, // or new Date() if you want an empty date
  
    // Contracting Parties
    husbandContractParty: {
      signature: '',
      agreement: false,
    },
    wifeContractParty: {
      signature: '',
      agreement: false,
    },
  
    // Marriage License Details
    marriageLicenseDetails: {
      dateIssued: undefined, // or new Date() if you want an empty date
      placeIssued: '',
      licenseNumber: '',
      marriageAgreement: false,
    },
  
    // Marriage Article
    marriageArticle: {
      article: '',
      marriageArticle: false,
    },
  
    // Marriage Settlement
    marriageSettlement: false,
  
    // Solemnizing Officer
    solemnizingOfficer: {
      name: '',
      position: '',
      signature: '',
      registryNoExpiryDate: '',
    },
  
    // Registered at Civil Registrar
    preparedBy: {
      date: undefined, // or new Date() if you want an empty date
      nameInPrint: '',
      signature: '',
      titleOrPosition: '',
    },
    receivedBy: {
      date: undefined, // or new Date() if you want an empty date
      nameInPrint: '',
      signature: '',
      titleOrPosition: '',
    },
    registeredByOffice: {
      date: undefined, // or new Date() if you want an empty date
      nameInPrint: '',
      signature: '',
      titleOrPosition: '',
    },
  
    // Optional Sections
    remarks: '',
  
    // Back page data - Affidavit of Solemnizing Officer
    affidavitOfSolemnizingOfficer: {
      solemnizingOfficerInformation: {
        officerName: {
          first: '',
          middle: '',
          last: '',
        },
        officeName: '',
        signature: '',
        address: '',
      },
      administeringOfficerInformation: {
        adminName: {
          first: '',
          middle: '',
          last: '',
        },
        position: '',
        address: '',
        signature: '',
      },
      a: {
        nameOfHusband: {
          first: '',
          middle: '',
          last: '',
        },
        nameOfWife: {
          first: '',
          middle: '',
          last: '',
        },
      },
      b: {
        a: false,
        b: false,
        c: false,
        d: false,
        e: false,
      },
      c: '',
      d: {
        dayOf: undefined, // or new Date() if you want an empty date
        atPlaceExecute: {
          st: '',
          barangay: '',
          cityMunicipality: '',
          province: '',
          country: '',
        },
      },
      dateSworn: {
        dayOf: undefined, // or new Date() if you want an empty date
        atPlaceOfSworn: {
          st: '',
          barangay: '',
          cityMunicipality: '',
          province: '',
          country: '',
        },
        ctcInfo: {
          number: '',
          dateIssued: undefined, // or new Date() if you want an empty date
          placeIssued: '',
        },
      },
    },
  
    // Affidavit for Delayed Registration
    affidavitForDelayed: {
      delayedRegistration: 'No',
      administeringInformation: {
        adminSignature: '',
        adminName: '',
        position: '',
        adminAddress: '',
      },
      applicantInformation: {
        signatureOfApplicant: '',
        nameOfApplicant: '',
        postalCode: '',
        applicantAddress: {
          st: '',
          barangay: '',
          cityMunicipality: '',
          province: '',
          country: '',
        },
      },
      a: {
        a: {
          agreement: false,
          nameOfPartner: {
            first: '',
            middle: '',
            last: '',
          },
          placeOfMarriage: '',
          dateOfMarriage: undefined, // or new Date() if you want an empty date
        },
        b: {
          agreement: false,
          nameOfHusband: {
            first: '',
            middle: '',
            last: '',
          },
          nameOfWife: {
            first: '',
            middle: '',
            last: '',
          },
          placeOfMarriage: '',
          dateOfMarriage: undefined, // or new Date() if you want an empty date
        },
      },
      b: {
        solemnizedBy: '',
        sector: '' as 'religious-ceremony' | 'civil-ceremony' | 'Muslim-rites' | 'tribal-rites', // Cast to satisfy TypeScript
      },
      c: {
        a: {
          licenseNo: '',
          dateIssued: undefined, // or new Date() if you want an empty date
          placeOfSolemnizedMarriage: '',
        },
        b: {
          underArticle: '',
        },
      },
      d: {
        husbandCitizenship: '',
        wifeCitizenship: '',
      },
      e: '',
      f: {
        date: undefined, // or new Date() if you want an empty date
        place: {
          st: '',
          barangay: '',
          cityMunicipality: '',
          province: '',
          country: '',
        },
      },
      dateSworn: {
        dayOf: undefined, // or new Date() if you want an empty date
        atPlaceOfSworn: {
          st: '',
          barangay: '',
          cityMunicipality: '',
          province: '',
          country: '',
        },
        ctcInfo: {
          number: '',
          dateIssued: undefined, // or new Date() if you want an empty date
          placeIssued: '',
        },
      },
    },
  };

export function useMarriageCertificateForm({
    onOpenChange,
    defaultValues
}: UseMarriageCertificateFormProps = {}) {
    const [isInitialized, setIsInitialized] = useState(false);
    const [initialValues, setInitialValues] = useState<Partial<MarriageCertificateFormValues> | undefined>(undefined);
    // When initializing your component or hook
    const [baseFormId, setBaseFormId] = useState<string | undefined>(undefined);

    const formMethods = useForm<MarriageCertificateFormValues>({
        resolver: zodResolver(marriageCertificateSchema),
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: defaultValues || emptyDefaults,
    });

    const router = useRouter();

    // Reset the form when defaultValues change (for edit mode)
    useEffect(() => {
        if (defaultValues && !isInitialized) {
            // Set the form values once and mark as initialized
            formMethods.reset(defaultValues);
            setIsInitialized(true);

            if ('baseFormId' in defaultValues) {
                // @ts-ignore - Access baseFormId even though it's not in the type
                setBaseFormId(defaultValues.baseFormId);
            }
        }
    }, [defaultValues, formMethods, isInitialized]);




    const handleFileUploads = async (data: any) => {
        // Create a deep copy to avoid mutating the original
        const processedData = { ...data };

        // Process all signatures
        // Prepared By, Received By, and Registered By signatures
        if (processedData.preparedBy?.signature instanceof File) {
            processedData.preparedBy.signature = await fileToBase64(processedData.preparedBy.signature);
        }

        if (processedData.receivedBy?.signature instanceof File) {
            processedData.receivedBy.signature = await fileToBase64(processedData.receivedBy.signature);
        }

        if (processedData.registeredByOffice?.signature instanceof File) {
            processedData.registeredByOffice.signature = await fileToBase64(processedData.registeredByOffice.signature);
        }

        // Solemnizing Officer signature
        if (processedData.solemnizingOfficer?.signature instanceof File) {
            processedData.solemnizingOfficer.signature = await fileToBase64(processedData.solemnizingOfficer.signature);
        }

        // Contracting Parties signatures
        if (processedData.husbandContractParty?.signature instanceof File) {
            processedData.husbandContractParty.signature = await fileToBase64(
                processedData.husbandContractParty.signature
            );
        }

        if (processedData.wifeContractParty?.signature instanceof File) {
            processedData.wifeContractParty.signature = await fileToBase64(
                processedData.wifeContractParty.signature
            );
        }

        // Witnesses signatures
        if (processedData.husbandWitnesses) {
            processedData.husbandWitnesses = await Promise.all(
                processedData.husbandWitnesses.map(async (witness: any) => ({
                    ...witness,
                    signature: witness.signature instanceof File
                        ? await fileToBase64(witness.signature)
                        : witness.signature
                }))
            );
        }

        if (processedData.wifeWitnesses) {
            processedData.wifeWitnesses = await Promise.all(
                processedData.wifeWitnesses.map(async (witness: any) => ({
                    ...witness,
                    signature: witness.signature instanceof File
                        ? await fileToBase64(witness.signature)
                        : witness.signature
                }))
            );
        }

        // Affidavit of Solemnizing Officer
        if (processedData.affidavitOfSolemnizingOfficer) {
            if (processedData.affidavitOfSolemnizingOfficer.solemnizingOfficerInformation?.signature instanceof File) {
                processedData.affidavitOfSolemnizingOfficer.solemnizingOfficerInformation.signature =
                    await fileToBase64(processedData.affidavitOfSolemnizingOfficer.solemnizingOfficerInformation.signature);
            }

            if (processedData.affidavitOfSolemnizingOfficer.administeringOfficerInformation?.signature instanceof File) {
                processedData.affidavitOfSolemnizingOfficer.administeringOfficerInformation.signature =
                    await fileToBase64(processedData.affidavitOfSolemnizingOfficer.administeringOfficerInformation.signature);
            }
        }
        // Affidavit for Delayed Registration (optional)
        if (processedData.affidavitForDelayed && processedData.affidavitForDelayed.delayedRegistration === 'Yes') {
            // Check if administeringInformation exists before accessing its properties
            if (processedData.affidavitForDelayed.administeringInformation) {
                if (processedData.affidavitForDelayed.administeringInformation.adminSignature instanceof File) {
                    processedData.affidavitForDelayed.administeringInformation.adminSignature =
                        await fileToBase64(processedData.affidavitForDelayed.administeringInformation.adminSignature);
                }
            }

            // Check if applicantInformation exists before accessing its properties
            if (processedData.affidavitForDelayed.applicantInformation) {
                if (processedData.affidavitForDelayed.applicantInformation.signatureOfApplicant instanceof File) {
                    processedData.affidavitForDelayed.applicantInformation.signatureOfApplicant =
                        await fileToBase64(processedData.affidavitForDelayed.applicantInformation.signatureOfApplicant);
                }
            }
        } else if (processedData.affidavitForDelayed) {
            // If not a 'Yes' for delayed registration, set to null or a minimal object
            processedData.affidavitForDelayed = {
                delayedRegistration: 'No'
            };
        }

        return processedData;
    };

    const onSubmit = async (data: MarriageCertificateFormValues) => {


        if (!formMethods.formState.isValid) {
            console.error("Form is invalid, submission blocked");
            return;
        }

        try {
            // Handle affidavitForDelayed as before
            if (data.affidavitForDelayed?.delayedRegistration === 'No') {
                data.affidavitForDelayed = {
                    delayedRegistration: 'No'
                };
            }

            const preparedData = preparePrismaData(data);
            const processedData = await handleFileUploads(preparedData);

            // Check if we're in edit mode
            const isEditMode = Boolean(defaultValues && defaultValues.id);

            let result;

            // Then in your onSubmit function
            if (isEditMode) {
                console.log('Edit mode - updating existing record with ID:', defaultValues?.id);
                result = await updateMarriageCertificateForm(
                    defaultValues?.id as string, // Only pass the ID
                    processedData
                );

                // Update operation has success and message/error properties
                if (result.success) {
                    toast.success('Marriage certificate updated successfully');
                    onOpenChange?.(false);
                    formMethods.reset();
                } else {
                    if ('error' in result) {
                        console.log('Update error:', result.error);
                        toast.error(result.error.includes('No user found with name')
                            ? 'Invalid prepared by user. Please check the name.'
                            : result.error);
                    } else {
                        console.log('Update message:', result.message);
                        toast.error(result.message);
                    }
                }
            } else {
                console.log('Create mode - creating new record');
                result = await submitMarriageCertificateForm(processedData);

                // Create operation has data property
                if ('data' in result) {
                    toast.success(`Marriage certificate submitted successfully (Book ${result.data.bookNumber}, Page ${result.data.pageNumber})`);
                    notifyUsersWithPermission(
                        Permission.DOCUMENT_READ,
                        "New uploaded Marriage Certificate",
                        `New Marriage Certificate with the details (Book ${result.data.bookNumber}, Page ${result.data.pageNumber}, Registry Number ${data.registryNumber}) has been uploaded.`
                    );

                    onOpenChange?.(false);
                    formMethods.reset();
                } else if ('error' in result) {
                    console.log('Submission error:', result.error);
                    toast.error(result.error.includes('No user found with name')
                        ? 'Invalid prepared by user. Please check the name.'
                        : result.error);
                }
            }
        } catch (error) {
            console.error('Error processing form:', error);
            toast.error('An unexpected error occurred');
            return { success: false, error: 'Internal server error' };
        }
    };

    const handleError = (errors: any) => {
        console.error("❌ Form Errors:", errors);
        console.log("handleError triggered, preventing submission");

        const errorMessages: string[] = [];

        Object.entries(errors).forEach(([fieldName, error]: any) => {
            if (error?.message) {
                errorMessages.push(`${formatFieldName(fieldName)}: ${error.message}`);
            } else if (typeof error === "object") {
                Object.entries(error).forEach(([subField, subError]: any) => {
                    if (subError?.message) {
                        errorMessages.push(`${formatFieldName(fieldName)} → ${formatFieldName(subField)}: ${subError.message}`);
                    }
                });
            }
        });

        if (errorMessages.length > 0) {
            toast.error(errorMessages.join("\n"));
        } else {
            toast.error("Please check the form for errors");
        }
    };


    // const onSubmit = async (data: MarriageCertificateFormValues) => {
    //     try {
    //         console.log('✅ Form Data Submitted:', JSON.stringify(data, null, 2)); // Pretty-print JSON data
    //         console.log('✅ Form Current State:', JSON.stringify(formMethods.getValues(), null, 2)); // Debug current state

    //         toast.success('Form submitted successfully');
    //         onOpenChange?.(false);
    //     } catch (error) {
    //         console.error('❌ Error submitting form:', error);
    //         toast.error('Submission failed, please try again');
    //     }
    // };

    // Extract file upload processing to a separate function

    // Helper function to make field names user-friendly
    const formatFieldName = (fieldName: string) => {
        return fieldName
            .replace(/([A-Z])/g, " $1") // Add space before capital letters
            .replace(/\./g, " → ") // Replace dots with arrows
            .trim()
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter
    };

    // ✅ Watch changes in husband's and wife's names
    const husbandName = useWatch({ control: formMethods.control, name: 'husbandName' });
    const wifeName = useWatch({ control: formMethods.control, name: 'wifeName' });

    // ✅ Sync husband's name to affidavit
    React.useEffect(() => {
        if (husbandName) {
            formMethods.setValue('affidavitOfSolemnizingOfficer.a.nameOfHusband', {
                first: husbandName.first || '',
                middle: husbandName.middle || '',
                last: husbandName.last || '',
            });
        }
    }, [husbandName, formMethods]);

    // ✅ Sync wife's name to affidavit
    React.useEffect(() => {
        if (wifeName) {
            formMethods.setValue('affidavitOfSolemnizingOfficer.a.nameOfWife', {
                first: wifeName.first || '',
                middle: wifeName.middle || '',
                last: wifeName.last || '',
            });
        }
    }, [wifeName, formMethods]);

    return { formMethods, onSubmit, handleError };
}