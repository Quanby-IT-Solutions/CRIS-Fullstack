// src\hooks\form-certificate-actions.tsx
'use server';

import { prisma } from '@/lib/prisma';
import {
  BirthCertificateFormValues,
  DeathCertificateFormValues,
  MarriageCertificateFormValues,
} from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import { revalidatePath } from 'next/cache';

export async function createMarriageCertificate(
  data: MarriageCertificateFormValues
) {
  try {
    const baseForm = await prisma.baseRegistryForm.create({
      data: {
        formNumber: '97',
        formType: 'MARRIAGE',
        registryNumber: data.registryNo,
        province: data.province,
        cityMunicipality: data.cityMunicipality,
        pageNumber: '1',
        bookNumber: '1',
        dateOfRegistration: new Date(),
        status: 'PENDING',

        marriageCertificateForm: {
          create: {
            // Husband's Information
            husbandFirstName: data.husbandFirstName,
            husbandMiddleName: data.husbandMiddleName,
            husbandLastName: data.husbandLastName,
            husbandAge: data.husbandAge,
            husbandDateOfBirth: data.husbandDateOfBirth,
            husbandPlaceOfBirth: data.husbandPlaceOfBirth,
            husbandSex: data.husbandSex,
            husbandCitizenship: data.husbandCitizenship,
            husbandResidence: data.husbandResidence,
            husbandReligion: data.husbandReligion,
            husbandCivilStatus: data.husbandCivilStatus,

            // Husband's Parents
            husbandFatherName: data.husbandFatherName,
            husbandFatherCitizenship: data.husbandFatherCitizenship,
            husbandMotherMaidenName: data.husbandMotherMaidenName,
            husbandMotherCitizenship: data.husbandMotherCitizenship,

            // Wife's Information
            wifeFirstName: data.wifeFirstName,
            wifeMiddleName: data.wifeMiddleName,
            wifeLastName: data.wifeLastName,
            wifeAge: data.wifeAge,
            wifeDateOfBirth: data.wifeDateOfBirth,
            wifePlaceOfBirth: data.wifePlaceOfBirth,
            wifeSex: data.wifeSex,
            wifeCitizenship: data.wifeCitizenship,
            wifeResidence: data.wifeResidence,
            wifeReligion: data.wifeReligion,
            wifeCivilStatus: data.wifeCivilStatus,

            // Wife's Parents
            wifeFatherName: data.wifeFatherName,
            wifeFatherCitizenship: data.wifeFatherCitizenship,
            wifeMotherMaidenName: data.wifeMotherMaidenName,
            wifeMotherCitizenship: data.wifeMotherCitizenship,

            // Consent Information
            husbandConsentPerson: {
              name: data.husbandConsentGivenBy,
              relationship: data.husbandConsentRelationship,
              residence: data.husbandConsentResidence,
            },
            wifeConsentPerson: {
              name: data.wifeConsentGivenBy,
              relationship: data.wifeConsentRelationship,
              residence: data.wifeConsentResidence,
            },

            // Marriage Details
            placeOfMarriage: data.placeOfMarriage,
            dateOfMarriage: data.dateOfMarriage,
            timeOfMarriage: data.timeOfMarriage,

            // Required fields with default values
            marriageSettlement: false,
            witnesses: [],
            solemnizingOfficer: {
              name: 'Default Officer',
              position: 'Marriage Officer',
              religion: 'Roman Catholic',
              registryNoExpiryDate: '2025-12-31',
            },

            // Optional fields with default values
            marriageLicenseDetails: {
              number: 'LICENSE-2024-001',
              dateIssued: new Date().toISOString(),
              placeIssued: 'Malolos, Bulacan',
            },
            noMarriageLicense: false,
            executiveOrderApplied: false,
            presidentialDecreeApplied: false,
            contractingPartiesSignature: {
              husband: '',
              wife: '',
            },
            solemnizingOfficerSignature: '',
          },
        },
      },
    });

    revalidatePath('/marriage-certificates');
    return { success: true, data: baseForm };
  } catch (error) {
    console.error('Error creating marriage certificate:', error);
    return { success: false, error: 'Failed to create marriage certificate' };
  }
}

// Death Certificate Server Action
export async function createDeathCertificate(data: DeathCertificateFormValues) {
  try {
    const baseForm = await prisma.baseRegistryForm.create({
      data: {
        formNumber: '103', // Form 103 for Death Certificate
        formType: 'DEATH',
        registryNumber: data.registryNumber,
        province: data.province,
        cityMunicipality: data.cityMunicipality,
        pageNumber: '1', // Default for testing
        bookNumber: '1', // Default for testing
        dateOfRegistration: new Date(),
        status: 'PENDING',

        deathCertificateForm: {
          create: {
            // Deceased Information
            deceasedName: {
              first: data.name.first,
              middle: data.name.middle,
              last: data.name.last,
            },
            sex: data.sex,
            dateOfDeath: data.dateOfDeath,
            placeOfDeath: {
              cityMunicipality: data.placeOfDeath,
              province: data.province,
            },
            dateOfBirth: data.dateOfBirth,
            placeOfBirth: {
              cityMunicipality: data.placeOfDeath,
              province: data.province,
            },
            civilStatus: data.civilStatus,
            religion: data.religion,
            citizenship: data.citizenship,
            residence: {
              houseNo: '', // You might want to parse this from data.residence
              barangay: '', // Parse from data.residence
              cityMunicipality: data.cityMunicipality,
              province: data.province,
            },
            occupation: data.occupation,

            // Parents Information
            nameOfFather: data.fatherName,
            nameOfMother: data.motherMaidenName,

            // Medical Information
            causesOfDeath: {
              immediate: data.causesOfDeath.immediate,
              antecedent: data.causesOfDeath.antecedent,
              underlying: data.causesOfDeath.underlying,
              otherSignificant: data.causesOfDeath.contributingConditions,
            },
            deathInterval: {}, // Add appropriate data structure
            pregnancy:
              data.sex === 'Female' ? data.maternalCondition !== 'none' : false,
            attendedByPhysician: data.certification.hasAttended,
            mannerOfDeath: data.deathByExternalCauses.mannerOfDeath,
            placeOfOccurrence: data.deathByExternalCauses.placeOfOccurrence,

            // Certification
            certificationType: 'Hospital Authority', // Adjust based on data
            certifier: {
              name: data.certification.nameInPrint,
              title: data.certification.titleOfPosition,
              address: data.certification.address,
              signature: data.certification.signature,
              date: data.certification.date,
            },

            // Disposal
            disposalDetails: {
              method: data.disposal.method,
              place: data.cemeteryAddress,
              date: data.disposal.burialPermit.dateIssued,
            },

            // Informant
            informant: {
              name: data.informant.nameInPrint,
              signature: data.informant.signature,
              relationship: data.informant.relationshipToDeceased,
              address: data.informant.address,
              date: data.informant.date,
            },

            // Preparer
            preparer: {
              name: data.preparedBy.nameInPrint,
              signature: data.preparedBy.signature,
              title: data.preparedBy.titleOrPosition,
              date: data.preparedBy.date,
            },

            // Burial Permit
            burialPermit: data.disposal.burialPermit.number
              ? {
                  number: data.disposal.burialPermit.number,
                  date: data.disposal.burialPermit.dateIssued.toISOString(), // Convert Date to string
                  cemetery: data.cemeteryAddress,
                }
              : undefined, // Use undefined instead of null
          },
        },
      },
    });

    revalidatePath('/users/admin'); // Adjust based on your route
    return { success: true, data: baseForm };
  } catch (error) {
    console.error('Error creating death certificate:', error);
    return { success: false, error: 'Failed to create death certificate' };
  }
}

// ------------------------------- Birth Certificate Server Action -------------------------------//
export async function createBirthCertificate(data: BirthCertificateFormValues) {
  try {
    const baseForm = await prisma.baseRegistryForm.create({
      data: {
        formNumber: '102', // Form 102 for Birth Certificate
        formType: 'BIRTH',
        registryNumber: data.registryNo,
        province: data.province,
        cityMunicipality: data.cityMunicipality,
        pageNumber: '1', // Add the pageNumber field
        bookNumber: '1', // Add the bookNumber field

        birthCertificateForm: {
          create: {
            // Child Information
            childName: {
              first: data.childInfo.firstName,
              middle: data.childInfo.middleName,
              last: data.childInfo.lastName,
            },
            sex: data.childInfo.sex,
            dateOfBirth: new Date(
              `${data.childInfo.dateOfBirth.year}-${data.childInfo.dateOfBirth.month}-${data.childInfo.dateOfBirth.day}`
            ),
            placeOfBirth: data.childInfo.placeOfBirth,
            typeOfBirth: data.childInfo.typeOfBirth,
            multipleBirthOrder: data.childInfo.multipleBirth,
            birthOrder: data.childInfo.birthOrder,
            weightAtBirth: parseFloat(data.childInfo.weight),

            // Mother Information
            motherMaidenName: {
              first: data.motherInfo.firstName,
              middle: data.motherInfo.middleName,
              last: data.motherInfo.lastName,
            },
            motherCitizenship: data.motherInfo.citizenship,
            motherReligion: data.motherInfo.religion,
            motherOccupation: data.motherInfo.occupation,
            motherAge: parseInt(data.motherInfo.age),
            motherResidence: data.motherInfo.residence,
            totalChildrenBornAlive: parseInt(data.motherInfo.totalChildren),
            childrenStillLiving: parseInt(data.motherInfo.livingChildren),
            childrenNowDead: parseInt(data.motherInfo.childrenDead),

            // Father Information
            fatherName: {
              first: data.fatherInfo.firstName,
              middle: data.fatherInfo.middleName,
              last: data.fatherInfo.lastName,
            },
            fatherCitizenship: data.fatherInfo.citizenship,
            fatherReligion: data.fatherInfo.religion,
            fatherOccupation: data.fatherInfo.occupation,
            fatherAge: parseInt(data.fatherInfo.age),
            fatherResidence: data.fatherInfo.residence,

            // Marriage Information
            parentMarriage: {
              date: new Date(
                `${data.marriageOfParents.date.year}-${data.marriageOfParents.date.month}-${data.marriageOfParents.date.day}`
              ),
              place: data.marriageOfParents.place,
            },

            // Certification Details
            attendant: data.attendant,
            informant: data.informant,
            preparer: data.preparedBy,

            // Additional Legal Details
            hasAffidavitOfPaternity: false, // Default to false for now
          },
        },

        // Received By Information
        receivedBy: data.receivedBy.name,
        receivedByPosition: data.receivedBy.title,
        receivedDate: new Date(data.receivedBy.date),

        // Registered At Information
        registeredBy: data.registeredByOffice.name,
        registeredByPosition: data.registeredByOffice.title,
        registrationDate: new Date(data.registeredByOffice.date),

        // Document Management
        remarks: data.remarks,

        // Set dateOfRegistration to current date
        dateOfRegistration: new Date(),
      },
    });

    revalidatePath('/birth-certificates');
    return { success: true, data: baseForm };
  } catch (error) {
    console.error('Error creating birth certificate:', error);
    return { success: false, error: 'Failed to create birth certificate' };
  }
}
