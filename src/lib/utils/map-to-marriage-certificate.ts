import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action';
import { MarriageCertificateFormValues } from '../types/zod-form-certificate/marriage-certificate-form-schema';

// Define a type for the Marriage certificate form structure based on your Prisma model
interface MarriageCertificateFormData {
    id?: string;
    baseFormId?: string;
    husbandFirstName?: string;
    husbandMiddleName?: string;
    husbandLastName?: string;
    husbandDateOfBirth?: Date;
    husbandAge?: number;
    husbandPlaceOfBirth?: any;
    husbandSex?: string;
    husbandCitizenship?: string;
    husbandResidence?: string;
    husbandReligion?: string;
    husbandCivilStatus?: string;
    husbandFatherName?: any;
    husbandFatherCitizenship?: string;
    husbandMotherMaidenName?: any;
    husbandMotherCitizenship?: string;
    husbandConsentPerson?: any;

    wifeFirstName?: string;
    wifeMiddleName?: string;
    wifeLastName?: string;
    wifeDateOfBirth?: Date;
    wifeAge?: number;
    wifePlaceOfBirth?: any;
    wifeSex?: string;
    wifeCitizenship?: string;
    wifeResidence?: string;
    wifeReligion?: string;
    wifeCivilStatus?: string;
    wifeFatherName?: any;
    wifeFatherCitizenship?: string;
    wifeMotherMaidenName?: any;
    wifeMotherCitizenship?: string;
    wifeConsentPerson?: any;
    remarks?: string;

    placeOfMarriage?: any;
    dateOfMarriage?: Date;
    timeOfMarriage?: Date;
    contractDay?: Date;

    marriageSettlement?: boolean;
    husbandContractParty?: any;
    wifeContractParty?: any;
    marriageLicenseDetails?: any;
    marriageArticle?: any;
    executiveOrderApplied?: boolean;
    solemnizingOfficer?: any;
    witnesses?: any[];

    registeredByOffice?: any;
    receivedByOffice?: any;
    preparedByOffice?: any;


    affidavitOfSolemnizingOfficer?: any;
    affidavitOfdelayedRegistration?: any;
    baseForm?: any;
}

// Helper function to map BaseRegistryFormWithRelations to MarriageCertificateFormValues
// Helper function to map BaseRegistryFormWithRelations to MarriageCertificateFormValues
export const mapToMarriageCertificateValues = (
    form: BaseRegistryFormWithRelations
): Partial<MarriageCertificateFormValues> => {
    // Extract the Marriage certificate form data with proper typing
    const marriageForm =
        (form.marriageCertificateForm as MarriageCertificateFormData) || {};

    // Helper for parsing dates safely
    const parseDateSafely = (
        dateValue: Date | string | null | undefined
    ): Date | undefined => {
        if (!dateValue) return undefined;
        try {
            return new Date(dateValue);
        } catch (error) {
            console.error('Error parsing date:', error);
            return undefined;
        }
    };

    // Helper to ensure non-null string values
    const ensureString = (value: any): string => {
        if (value === null || value === undefined) return '';
        return String(value);
    };

    // Helper to validate civil status values - adjusted to match expected schema types
    const validateCivilStatus = (
        status: any
    ): 'Single' | 'Widowed' | 'Divorced' | undefined => {
        // Map old values to new expected values
        const statusMap: Record<string, 'Single' | 'Widowed' | 'Divorced' | undefined> = {
            'Single': 'Single',
            'Married': 'Single', // Map Married to Single as it's not allowed in the schema
            'Widow': 'Widowed',
            'Widower': 'Widowed',
            'Annulled': 'Divorced', // Map Annulled to Divorced as it's similar
            'Divorced': 'Divorced'
        };

        if (status && statusMap[status]) {
            return statusMap[status];
        }

        return undefined;
    };

    // For husband, we allow Male only
    const validateHusbandSex = (sex: any): 'Male' | undefined => {
        return sex === 'Male' ? 'Male' : undefined;
    };

    // For wife, we allow Female only
    const validateWifeSex = (sex: any): 'Female' | undefined => {
        return sex === 'Female' ? 'Female' : undefined;
    };

    // Validate delayed registration value to ensure it's "Yes" or "No"
    const validateDelayedRegistration = (value: any): 'Yes' | 'No' => {
        // If the value is truthy (including 'Yes', true, 1, etc.) and not explicitly 'No'
        if (value && value !== 'No') {
            return 'Yes';
        }
        return 'No';
    };

    const validateSector = (sector: any):
        | 'religious-ceremony'
        | 'civil-ceremony'
        | 'Muslim-rites'
        | 'tribal-rites' | undefined => {
        const validSectors = [
            'religious-ceremony',
            'civil-ceremony',
            'Muslim-rites',
            'tribal-rites',
        ];

        if (validSectors.includes(sector)) {
            return sector as
                | 'religious-ceremony'
                | 'civil-ceremony'
                | 'Muslim-rites'
                | 'tribal-rites';
        }

        return undefined;
    };

    // Create empty objects for nested structures if they don't exist
    const createNameObject = (nameObj: any) => {
        if (!nameObj) return { first: '', middle: '', last: '' };
        return {
            first: ensureString(nameObj.first),
            middle: ensureString(nameObj.middle),
            last: ensureString(nameObj.last)
        };
    };

    const createAddressObject = (addressObj: any) => {
        if (!addressObj) return {
            houseNo: '',
            street: '',
            st: '',
            barangay: '',
            cityMunicipality: '',
            province: '',
            country: ''
        };

        return {
            houseNo: typeof addressObj.houseNo === 'object' && addressObj.houseNo
                ? ensureString(addressObj.houseNo.value || addressObj.houseNo)
                : ensureString(addressObj.houseNo),
            street: typeof addressObj.street === 'object' && addressObj.street
                ? ensureString(addressObj.street.value || addressObj.street)
                : ensureString(addressObj.street),
            st: typeof addressObj.st === 'object' && addressObj.st
                ? ensureString(addressObj.st.value || addressObj.st)
                : ensureString(addressObj.st),
            barangay: typeof addressObj.barangay === 'object' && addressObj.barangay
                ? ensureString(addressObj.barangay.value || addressObj.barangay)
                : ensureString(addressObj.barangay),
            cityMunicipality: typeof addressObj.cityMunicipality === 'object' && addressObj.cityMunicipality
                ? ensureString(addressObj.cityMunicipality.value || addressObj.cityMunicipality)
                : ensureString(addressObj.cityMunicipality),
            province: typeof addressObj.province === 'object' && addressObj.province
                ? ensureString(addressObj.province.value || addressObj.province)
                : ensureString(addressObj.province),
            country: typeof addressObj.country === 'object' && addressObj.country
                ? ensureString(addressObj.country.value || addressObj.country)
                : ensureString(addressObj.country)
        };
    };

    // Initialize the return object with the structure from MarriageCertificateFormValues
    const result: Partial<MarriageCertificateFormValues> = {};

    // Map basic registry information
    result.registryNumber = ensureString(form.registryNumber);
    result.province = ensureString(form.province);
    result.cityMunicipality = ensureString(form.cityMunicipality);
    result.pagination = {
        pageNumber: ensureString(form.pageNumber),
        bookNumber: ensureString(form.bookNumber),
    };
    result.remarks = ensureString(marriageForm.remarks || form.remarks);

        // Husband information
        husbandName: {
            first: typeof marriageForm.husbandFirstName === 'object' && marriageForm.husbandFirstName
                ? ensureString(marriageForm.husbandFirstName)
                : ensureString(marriageForm.husbandFirstName),
            middle: typeof marriageForm.husbandMiddleName === 'object' && marriageForm.husbandMiddleName
                ? ensureString(marriageForm.husbandMiddleName)
                : ensureString(marriageForm.husbandMiddleName),
            last: typeof marriageForm.husbandLastName === 'object' && marriageForm.husbandLastName
                ? ensureString(marriageForm.husbandLastName)
                : ensureString(marriageForm.husbandLastName),
        },
        husbandAge: marriageForm.husbandAge || 0,
        husbandBirth: parseDateSafely(marriageForm.husbandDateOfBirth),
        husbandPlaceOfBirth: createAddressObject(marriageForm.husbandPlaceOfBirth),
        husbandSex: validateHusbandSex(marriageForm?.husbandSex) || 'Male',
        husbandCitizenship: ensureString(marriageForm.husbandCitizenship),
        husbandResidence: ensureString(marriageForm.husbandResidence),
        husbandReligion: ensureString(marriageForm.husbandReligion),
        husbandCivilStatus: validateCivilStatus(marriageForm.husbandCivilStatus) || 'Single',
        husbandParents: {
            fatherName: createNameObject(marriageForm.husbandFatherName),
            fatherCitizenship: ensureString(marriageForm.husbandFatherCitizenship),
            motherName: createNameObject(marriageForm.husbandMotherMaidenName),
            motherCitizenship: ensureString(marriageForm.husbandMotherCitizenship)
        },
        husbandConsentPerson: {
            name: createNameObject(marriageForm.husbandConsentPerson?.name),
            relationship: ensureString(marriageForm.husbandConsentPerson?.relationship),
            residence: createAddressObject(marriageForm.husbandConsentPerson?.residence)
        },

        // Wife information
        wifeName: {
            first: typeof marriageForm.wifeFirstName === 'object' && marriageForm.wifeFirstName
                ? ensureString(marriageForm.wifeFirstName)
                : ensureString(marriageForm.wifeFirstName),
            middle: typeof marriageForm.wifeMiddleName === 'object' && marriageForm.wifeMiddleName
                ? ensureString(marriageForm.wifeMiddleName)
                : ensureString(marriageForm.wifeMiddleName),
            last: typeof marriageForm.wifeLastName === 'object' && marriageForm.wifeLastName
                ? ensureString(marriageForm.wifeLastName)
                : ensureString(marriageForm.wifeLastName),
        },
        wifeAge: marriageForm.wifeAge || 0,
        wifeBirth: parseDateSafely(marriageForm.wifeDateOfBirth),
        wifePlaceOfBirth: createAddressObject(marriageForm.wifePlaceOfBirth),
        wifeSex: validateWifeSex(marriageForm?.wifeSex) || 'Female',
        wifeCitizenship: ensureString(marriageForm.wifeCitizenship),
        wifeResidence: ensureString(marriageForm.wifeResidence),
        wifeReligion: ensureString(marriageForm.wifeReligion),
        wifeCivilStatus: validateCivilStatus(marriageForm.wifeCivilStatus) || 'Single',
        wifeParents: {
            fatherName: createNameObject(marriageForm.wifeFatherName),
            fatherCitizenship: ensureString(marriageForm.wifeFatherCitizenship),
            motherName: createNameObject(marriageForm.wifeMotherMaidenName),
            motherCitizenship: ensureString(marriageForm.wifeMotherCitizenship)
        },
        wifeConsentPerson: {
            name: createNameObject(marriageForm.wifeConsentPerson?.name),
            relationship: ensureString(marriageForm.wifeConsentPerson?.relationship),
            residence: createAddressObject(marriageForm.wifeConsentPerson?.residence)
        },

        // Marriage details
        placeOfMarriage: createAddressObject(marriageForm.placeOfMarriage),
        dateOfMarriage: parseDateSafely(marriageForm.dateOfMarriage),
        timeOfMarriage: parseDateSafely(marriageForm.timeOfMarriage),
        contractDay: parseDateSafely(marriageForm.contractDay),
        marriageSettlement: marriageForm.marriageSettlement || false,
        husbandContractParty: {
            signature: ensureString(marriageForm.husbandContractParty?.signature),
            agreement: Boolean(marriageForm.husbandContractParty?.agreement)
        },
        wifeContractParty: {
            signature: ensureString(marriageForm.wifeContractParty?.signature),
            agreement: Boolean(marriageForm.wifeContractParty?.agreement)
        },

        // License details
        marriageLicenseDetails: {
            dateIssued: parseDateSafely(marriageForm.marriageLicenseDetails?.dateIssued),
            placeIssued: ensureString(marriageForm.marriageLicenseDetails?.placeIssued),
            licenseNumber: ensureString(marriageForm.marriageLicenseDetails?.licenseNumber),
            marriageAgreement: marriageForm.marriageLicenseDetails?.marriageAgreement || false
        },
        marriageArticle: {
            article: ensureString(marriageForm.marriageArticle?.article),
            marriageArticle: marriageForm.marriageArticle?.marriageArticle || false
        },

    // Map marriage settlement
    result.marriageSettlement = marriageForm.marriageSettlement || false;

    // Map solemnizing officer information
    result.solemnizingOfficer = {
        name: ensureString(marriageForm.solemnizingOfficer?.name),
        position: ensureString(marriageForm.solemnizingOfficer?.position),
        signature: ensureString(marriageForm.solemnizingOfficer?.signature),
        registryNoExpiryDate: ensureString(marriageForm.solemnizingOfficer?.registryNoExpiryDate)
    };

    // Map witnesses - split into husband and wife witnesses based on the schema
    if (Array.isArray(marriageForm.witnesses) && marriageForm.witnesses.length > 0) {
        // If there are at least two witnesses, assign the first to husband, second to wife
        const husbandWitnesses = [];
        const wifeWitnesses = [];

        for (let i = 0; i < marriageForm.witnesses.length; i++) {
            const witness = {
                name: ensureString(marriageForm.witnesses[i].name),
                signature: ensureString(marriageForm.witnesses[i].signature)
            };

            if (i < 2) {
                husbandWitnesses.push(witness);
            } else {
                wifeWitnesses.push(witness);
            }
        }

        // Ensure at least 2 witnesses in each array
        while (husbandWitnesses.length < 2) {
            husbandWitnesses.push({ name: '', signature: '' });
        }

        while (wifeWitnesses.length < 2) {
            wifeWitnesses.push({ name: '', signature: '' });
        }

        result.husbandWitnesses = husbandWitnesses;
        result.wifeWitnesses = wifeWitnesses;
    } else {
        // Default empty witnesses
        result.husbandWitnesses = [
            { name: '', signature: '' },
            { name: '', signature: '' }
        ];
        result.wifeWitnesses = [
            { name: '', signature: '' },
            { name: '', signature: '' }
        ];
    }

    // Map registered by office information
    result.registeredByOffice = {
        date: parseDateSafely(marriageForm.registeredByOffice?.date),
        nameInPrint: ensureString(marriageForm.registeredByOffice?.nameInPrint),
        signature: ensureString(marriageForm.registeredByOffice?.signature),
        titleOrPosition: ensureString(marriageForm.registeredByOffice?.titleOrPosition)
    };

    // Initialize empty receivedBy and preparedBy fields (as they're required in the schema)
    result.receivedBy = {
        nameInPrint: '',
        titleOrPosition: '',
        date: undefined,
        signature: ''
    };

    result.preparedBy = {
        nameInPrint: '',
        titleOrPosition: '',
        date: undefined,
        signature: ''
    };

    // Map contract parties
    result.husbandContractParty = {
        signature: '',
        agreement: false
    };

    result.wifeContractParty = {
        signature: '',
        agreement: false
    };

    // Map affidavit of solemnizing officer with updated structure
    result.affidavitOfSolemnizingOfficer = {
        solemnizingOfficerInformation: {
            officeName: ensureString(marriageForm.affidavitOfSolemnizingOfficer?.solemnizingOfficerInformation?.officeName),
            officerName: createNameObject(marriageForm.affidavitOfSolemnizingOfficer?.solemnizingOfficerInformation?.officerName),
            signature: ensureString(marriageForm.affidavitOfSolemnizingOfficer?.solemnizingOfficerInformation?.signature),
            address: ensureString(marriageForm.affidavitOfSolemnizingOfficer?.solemnizingOfficerInformation?.address),
        },
        a: {
            nameOfHusband: createNameObject(marriageForm.affidavitOfSolemnizingOfficer?.a?.nameOfHusband),
            nameOfWife: createNameObject(marriageForm.affidavitOfSolemnizingOfficer?.a?.nameOfWife)
        },
        b: {
            a: marriageForm.affidavitOfSolemnizingOfficer?.b?.a || false,
            b: marriageForm.affidavitOfSolemnizingOfficer?.b?.b || false,
            c: marriageForm.affidavitOfSolemnizingOfficer?.b?.c || false,
            d: marriageForm.affidavitOfSolemnizingOfficer?.b?.d || false,
            e: marriageForm.affidavitOfSolemnizingOfficer?.b?.e || false
        },
        c: ensureString(marriageForm.affidavitOfSolemnizingOfficer?.c),
        d: {
            dayOf: parseDateSafely(marriageForm.affidavitOfSolemnizingOfficer?.d?.dayOf),
            atPlaceExecute: createAddressObject(marriageForm.affidavitOfSolemnizingOfficer?.d?.atPlaceExecute)
        },
        dateSworn: {
            dayOf: parseDateSafely(marriageForm.affidavitOfSolemnizingOfficer?.dateSworn?.dayOf),
            atPlaceOfSworn: createAddressObject(marriageForm.affidavitOfSolemnizingOfficer?.dateSworn?.atPlaceOfSworn),
            ctcInfo: {
                number: ensureString(marriageForm.affidavitOfSolemnizingOfficer?.dateSworn?.ctcInfo?.number),
                dateIssued: parseDateSafely(marriageForm.affidavitOfSolemnizingOfficer?.dateSworn?.ctcInfo?.dateIssued),
                placeIssued: ensureString(marriageForm.affidavitOfSolemnizingOfficer?.dateSworn?.ctcInfo?.placeIssued)
            }
        },
        administeringOfficerInformation: {
            adminName: createNameObject(marriageForm.affidavitOfSolemnizingOfficer?.administeringInformation?.adminName),
            position: ensureString(marriageForm.affidavitOfSolemnizingOfficer?.administeringInformation?.position),
            address: ensureString(marriageForm.affidavitOfSolemnizingOfficer?.administeringInformation?.address),
            signature: ensureString(marriageForm.affidavitOfSolemnizingOfficer?.administeringInformation?.signature?.signature),
        }
    };

    // Add delayed registration if available - with proper type handling
    if (marriageForm.affidavitOfdelayedRegistration) {
        result.affidavitForDelayed = {
            // Ensure this is 'Yes' or 'No' as required by the schema
            delayedRegistration: validateDelayedRegistration(
                marriageForm.affidavitOfdelayedRegistration.delayedRegistration || 'Yes'
            ),
            administeringInformation: {
                adminSignature: '',
                adminName: '',
                position: '',
                adminAddress: ''
            },
            applicantInformation: {
                signatureOfApplicant: ensureString(marriageForm.affidavitOfdelayedRegistration.applicantInformation?.signatureOfApplicant),
                nameOfApplicant: ensureString(marriageForm.affidavitOfdelayedRegistration.applicantInformation?.nameOfApplicant),
                postalCode: ensureString(marriageForm.affidavitOfdelayedRegistration.applicantInformation?.postalCode),
                applicantAddress: {
                    st: '',
                    barangay: '',
                    cityMunicipality: '',
                    province: '',
                    country: ''
                }
            },
            a: {
                a: {
                    agreement: false,
                    nameOfPartner: {
                        first: '',
                        middle: '',
                        last: ''
                    },
                    placeOfMarriage: '',
                    dateOfMarriage: undefined
                },
                b: {
                    agreement: false,
                    nameOfHusband: {
                        first: '',
                        middle: '',
                        last: ''
                    },
                    nameOfWife: {
                        first: '',
                        middle: '',
                        last: ''
                    },
                    placeOfMarriage: '',
                    dateOfMarriage: undefined
                }
            },
            b: {
                solemnizedBy: '',
                sector: validateSector(marriageForm.affidavitOfdelayedRegistration.b?.sector) || 'religious-ceremony',
            },
            c: {
                a: {
                    licenseNo: '',
                    dateIssued: undefined,
                    placeOfSolemnizedMarriage: ''
                },
                b: {
                    underArticle: ''
                }
            },
            d: {
                husbandCitizenship: '',
                wifeCitizenship: ''
            },
            e: '',
            f: {
                date: undefined,
                place: {
                    st: '',
                    barangay: '',
                    cityMunicipality: '',
                    province: '',
                    country: ''
                }
            },
            dateSworn: {
                dayOf: undefined,
                atPlaceOfSworn: {
                    st: '',
                    barangay: '',
                    cityMunicipality: '',
                    province: '',
                    country: ''
                },
                ctcInfo: {
                    number: '',
                    dateIssued: undefined,
                    placeIssued: ''
                }
            }
        };
    }

    return result;
};



