// src\hooks\form-certificate-actions.tsx
'use server';

import { prisma } from '@/lib/prisma';
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/form-schema-certificate';
import { isValidDate } from '@/utils/certificate-helper-functions';
import { FormType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

// -----------------------------HELPER FUNCTION--------------//


// ----------------------------END OF HELPER FUNCTION----------------------------------------//
export async function createMarriageCertificate(
  data: MarriageCertificateFormValues
) {
  try {
    // 1. Validate registry number
    const exists = await checkRegistryNumberExists(
      data.registryNumber,
      FormType.MARRIAGE
    );
    if (exists) {
      return {
        success: false,
        error: 'Registry number already exists. Please use a different number.',
      };
    }

    // 2. Validate dates
    const marriageDate = new Date(data.dateOfMarriage);
    const husbandBirthDate = new Date(data.husbandDateOfBirth);
    const wifeBirthDate = new Date(data.wifeDateOfBirth);

    if (
      !isValidDate(marriageDate, FormType.MARRIAGE) ||
      !isValidDate(husbandBirthDate, FormType.MARRIAGE) ||
      !isValidDate(wifeBirthDate, FormType.MARRIAGE)
    ) {
      return {
        success: false,
        error:
          'Invalid date format in marriage, husband birth, or wife birth date',
      };
    }

    // 3. Validate marriage date is after both birth dates
    if (marriageDate < husbandBirthDate || marriageDate < wifeBirthDate) {
      return {
        success: false,
        error: 'Marriage date cannot be before birth dates',
      };
    }
    const baseForm = await prisma.baseRegistryForm.create({
      data: {
        formNumber: '97',
        formType: 'MARRIAGE',
        registryNumber: data.registryNumber,
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

    revalidatePath('/civil-registry');
    return { success: true, data: baseForm };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: `Failed to create marriage certificate: ${error.message}`,
      };
    }
    return { success: false, error: 'Failed to create marriage certificate' };
  }
}

// Death Certificate Server Action

export async function createDeathCertificate(
  data: DeathCertificateFormValues,
  ignoreDuplicate: boolean = false
) {
  try {
    // Check for required dates
    if (!data.personalInfo.dateOfDeath) {
      return { success: false, error: 'Date of death is required' };
    }

    if (!data.personalInfo.dateOfBirth) {
      return { success: false, error: 'Date of birth is required' };
    }

    // Validate registry number format before checking in DB
    if (!/\d{4}-\d{5}/.test(data.registryNumber)) {
      return {
        success: false,
        error: 'Registry number must be in the format YYYY-#####',
      };
    }

    // Validate registry number does not already exist
    const existingRegistry = await prisma.baseRegistryForm.findFirst({
      where: {
        registryNumber: data.registryNumber,
        formType: 'DEATH',
      },
    });

    if (existingRegistry) {
      return {
        success: false,
        error: 'Registry number already exists. Please use a different number.',
      };
    }

    // Check for duplicate deceased information
    if (!ignoreDuplicate) {
      const existingDeceased = await prisma.deathCertificateForm.findFirst({
        where: {
          AND: [
            {
              deceasedName: {
                path: ['firstName'],
                string_contains: data.personalInfo.firstName.trim(),
              },
            },
            {
              deceasedName: {
                path: ['lastName'],
                string_contains: data.personalInfo.lastName.trim(),
              },
            },
            {
              dateOfDeath: data.personalInfo.dateOfDeath, // Now directly use the Date object
            },
            {
              placeOfDeath: {
                path: ['cityMunicipality'],
                string_contains:
                  data.personalInfo.placeOfDeath.cityMunicipality.trim(),
              },
            },
          ],
        },
      });

      if (existingDeceased) {
        return {
          success: false,
          warning: true,
          message:
            'Similar death record already exists. Do you want to proceed with saving this record?',
        };
      }
    }

    // Validate preparer exists
    const user = await prisma.user.findFirst({
      where: {
        name: data.preparedBy.name,
      },
    });

    if (!user) {
      return { success: false, error: 'Preparer not found' };
    }

    // Create the death certificate
    const baseForm = await prisma.baseRegistryForm.create({
      data: {
        formNumber: '103',
        formType: 'DEATH',
        registryNumber: data.registryNumber,
        province: data.province,
        cityMunicipality: data.cityMunicipality,
        pageNumber: '1',
        bookNumber: '1',
        dateOfRegistration: new Date(),
        status: 'PENDING',
        preparedBy: {
          connect: {
            id: user.id,
          },
        },
        deathCertificateForm: {
          create: {
            // Personal Information
            deceasedName: {
              firstName: data.personalInfo.firstName.trim(),
              middleName: data.personalInfo.middleName?.trim() || '',
              lastName: data.personalInfo.lastName.trim(),
            },
            sex: data.personalInfo.sex,
            dateOfDeath: data.personalInfo.dateOfDeath,
            dateOfBirth: data.personalInfo.dateOfBirth,
            placeOfDeath: {
              province: data.personalInfo.placeOfDeath.province.trim(),
              cityMunicipality:
                data.personalInfo.placeOfDeath.cityMunicipality.trim(),
              specificAddress:
                data.personalInfo.placeOfDeath.specificAddress?.trim() || '',
            },
            placeOfBirth: {
              province: data.personalInfo.placeOfDeath.province.trim(),
              cityMunicipality:
                data.personalInfo.placeOfDeath.cityMunicipality.trim(),
              specificAddress:
                data.personalInfo.placeOfDeath.specificAddress?.trim() || '',
            },
            civilStatus: data.personalInfo.civilStatus,
            religion: data.personalInfo.religion,
            citizenship: data.personalInfo.citizenship,
            residence: {
              address: data.personalInfo.residence.address,
              cityMunicipality: data.personalInfo.residence.cityMunicipality,
              province: data.personalInfo.residence.province,
              country: data.personalInfo.residence.country,
            },
            occupation: data.personalInfo.occupation,

            // Family Information
            nameOfFather: {
              firstName: data.familyInfo.father.firstName.trim(),
              middleName: data.familyInfo.father.middleName?.trim() || '',
              lastName: data.familyInfo.father.lastName.trim(),
            },
            nameOfMother: {
              firstName: data.familyInfo.mother.firstName.trim(),
              middleName: data.familyInfo.mother.middleName?.trim() || '',
              lastName: data.familyInfo.mother.lastName.trim(),
            },

            // Medical Information
            causesOfDeath: {
              immediate: data.medicalCertificate.causesOfDeath.immediate,
              antecedent: data.medicalCertificate.causesOfDeath.antecedent,
              underlying: data.medicalCertificate.causesOfDeath.underlying,
              contributingConditions:
                data.medicalCertificate.causesOfDeath.contributingConditions ||
                '',
            },
            deathInterval: {
              interval: data.personalInfo.ageAtDeath.years,
            },
            pregnancy: false,
            attendedByPhysician: data.certification.hasAttended === 'Yes',
            mannerOfDeath: data.medicalCertificate.externalCauses.mannerOfDeath,
            placeOfOccurrence:
              data.medicalCertificate.externalCauses.placeOfOccurrence,

            // Certification
            certificationType: 'STANDARD',
            certifier: {
              name: data.certification.name,
              title: data.certification.title,
              address: data.certification.address,
              date: data.certification.date,
            },

            // Disposal Information
            disposalDetails: {
              method: data.disposal.method,
              burialPermit: {
                number: data.disposal.burialPermit.number,
                dateIssued: data.disposal.burialPermit.dateIssued,
              },
              transferPermit: data.disposal.transferPermit.number
                ? {
                  number: data.disposal.transferPermit.number,
                  dateIssued: data.disposal.transferPermit.dateIssued || null,
                }
                : null,
              cemeteryAddress: data.disposal.cemeteryAddress,
            },

            // Informant Details
            informant: {
              name: data.informant.name,
              relationship: data.informant.relationship,
              address: data.informant.address,
              date: data.informant.date,
            },

            // Preparer Details
            preparer: {
              name: data.preparedBy.name,
              title: data.preparedBy.title,
              date: data.preparedBy.date,
            },
          },
        },
        // Additional base form fields
        receivedBy: data.receivedBy.name.trim(),
        receivedByPosition: data.receivedBy.title.trim(),
        receivedDate: data.receivedBy.date,
        registeredBy: data.registeredAtCivilRegistrar.name.trim(),
        registeredByPosition: data.registeredAtCivilRegistrar.title.trim(),
        registrationDate: data.registeredAtCivilRegistrar.date,
        remarks: data.remarks?.trim(),
      },
    });

    revalidatePath('/civil-registry');
    return {
      success: true,
      data: baseForm,
      message: 'Death certificate created successfully',
    };
  } catch (error) {
    console.error('Error creating death certificate:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create death certificate',
    };
  }
}
// ------------------------------- Birth Certificate Server Action -------------------------------//

export async function createBirthCertificate(
  data: BirthCertificateFormValues,
  ignoreDuplicateChild: boolean = false
) {
  try {
    // Validate required dates
    if (!data.childInfo.dateOfBirth) {
      return { success: false, error: 'Date of birth is required' };
    }

    if (!data.parentMarriage.date) {
      return { success: false, error: 'Parent marriage date is required' };
    }

    // Validate registry number format
    if (!/\d{4}-\d{5}/.test(data.registryNumber)) {
      return {
        success: false,
        error: 'Registry number must be in the format YYYY-#####',
      };
    }

    // Check for existing registry number
    const existingRegistry = await prisma.baseRegistryForm.findFirst({
      where: {
        registryNumber: data.registryNumber,
        formType: 'BIRTH',
      },
    });

    if (existingRegistry) {
      return {
        success: false,
        error: 'Registry number already exists. Please use a different number.',
      };
    }

    // Check for duplicate child
    if (!ignoreDuplicateChild) {
      const existingChild = await prisma.birthCertificateForm.findFirst({
        where: {
          AND: [
            {
              childName: {
                path: ['firstName'],
                string_contains: data.childInfo.firstName.trim(),
              },
            },
            {
              childName: {
                path: ['lastName'],
                string_contains: data.childInfo.lastName.trim(),
              },
            },
            {
              dateOfBirth: data.childInfo.dateOfBirth,
            },
            {
              placeOfBirth: {
                path: ['hospital'],
                string_contains: data.childInfo.placeOfBirth.hospital.trim(),
              },
            },
            {
              placeOfBirth: {
                path: ['cityMunicipality'],
                string_contains:
                  data.childInfo.placeOfBirth.cityMunicipality.trim(),
              },
            },
            {
              placeOfBirth: {
                path: ['province'],
                string_contains: data.childInfo.placeOfBirth.province.trim(),
              },
            },
          ],
        },
      });

      if (existingChild) {
        return {
          success: false,
          warning: true,
          message:
            'Child information already exists in the database. Do you want to proceed with saving this record?',
        };
      }
    }

    // Validate preparer exists
    const user = await prisma.user.findFirst({
      where: {
        name: data.preparedBy.name,
      },
    });

    if (!user) {
      return { success: false, error: 'Preparer not found' };
    }

    // Create the birth certificate
    const baseForm = await prisma.baseRegistryForm.create({
      data: {
        formNumber: '102',
        formType: 'BIRTH',
        registryNumber: data.registryNumber,
        province: data.province,
        cityMunicipality: data.cityMunicipality,
        pageNumber: '1',
        bookNumber: '1',
        dateOfRegistration: new Date(),
        status: 'PENDING',
        preparedBy: {
          connect: {
            id: user.id,
          },
        },
        birthCertificateForm: {
          create: {
            // Child Information
            childName: {
              firstName: data.childInfo.firstName.trim(),
              middleName: data.childInfo.middleName?.trim() || '',
              lastName: data.childInfo.lastName.trim(),
            },
            sex: data.childInfo.sex,
            dateOfBirth: data.childInfo.dateOfBirth,
            placeOfBirth: {
              hospital: data.childInfo.placeOfBirth.hospital.trim(),
              province: data.childInfo.placeOfBirth.province.trim(),
              cityMunicipality:
                data.childInfo.placeOfBirth.cityMunicipality.trim(),
            },
            typeOfBirth: data.childInfo.typeOfBirth,
            multipleBirthOrder: data.childInfo.multipleBirthOrder || null,
            birthOrder: data.childInfo.birthOrder || null,
            weightAtBirth: parseFloat(data.childInfo.weightAtBirth),

            // Mother Information
            motherMaidenName: {
              firstName: data.motherInfo.firstName.trim(),
              middleName: data.motherInfo.middleName?.trim() || '',
              lastName: data.motherInfo.lastName.trim(),
            },
            motherCitizenship: data.motherInfo.citizenship.trim(),
            motherReligion: data.motherInfo.religion?.trim(),
            motherOccupation: data.motherInfo.occupation?.trim(),
            motherAge: parseInt(data.motherInfo.age),
            motherResidence: {
              address: data.motherInfo.residence.address.trim(),
              province: data.motherInfo.residence.province.trim(),
              cityMunicipality:
                data.motherInfo.residence.cityMunicipality.trim(),
              country: data.motherInfo.residence.country.trim(),
            },
            totalChildrenBornAlive: parseInt(
              data.motherInfo.totalChildrenBornAlive
            ),
            childrenStillLiving: parseInt(data.motherInfo.childrenStillLiving),
            childrenNowDead: parseInt(data.motherInfo.childrenNowDead),

            // Father Information
            fatherName: {
              firstName: data.fatherInfo.firstName.trim(),
              middleName: data.fatherInfo.middleName?.trim() || '',
              lastName: data.fatherInfo.lastName.trim(),
            },
            fatherCitizenship: data.fatherInfo.citizenship.trim(),
            fatherReligion: data.fatherInfo.religion?.trim(),
            fatherOccupation: data.fatherInfo.occupation?.trim(),
            fatherAge: parseInt(data.fatherInfo.age),
            fatherResidence: {
              address: data.fatherInfo.residence.address.trim(),
              province: data.fatherInfo.residence.province.trim(),
              cityMunicipality:
                data.fatherInfo.residence.cityMunicipality.trim(),
              country: data.fatherInfo.residence.country.trim(),
            },

            // Marriage Information
            parentMarriage: {
              date: data.parentMarriage.date,
              place: {
                cityMunicipality:
                  data.parentMarriage.place.cityMunicipality.trim(),
                province: data.parentMarriage.place.province.trim(),
                country: data.parentMarriage.place.country.trim(),
              },
            },

            // Attendant Information
            attendant: {
              type: data.attendant.type,
              certification: {
                time: data.attendant.certification.time,
                signature: data.attendant.certification.signature || '',
                name: data.attendant.certification.name.trim(),
                title: data.attendant.certification.title.trim(),
                address: data.attendant.certification.address.trim(),
                date: data.attendant.certification.date,
              },
            },

            // Informant Information
            informant: {
              signature: data.informant.signature || '',
              name: data.informant.name.trim(),
              relationship: data.informant.relationship.trim(),
              address: data.informant.address.trim(),
              date: data.informant.date,
            },

            // Preparer Information
            preparer: {
              signature: data.preparedBy.signature || '',
              name: data.preparedBy.name.trim(),
              title: data.preparedBy.title.trim(),
              date: data.preparedBy.date,
            },

            // Affidavit of Paternity
            hasAffidavitOfPaternity: data.hasAffidavitOfPaternity,
            affidavitOfPaternityDetails: data.hasAffidavitOfPaternity
              ? {
                father: {
                  signature:
                    data.affidavitOfPaternityDetails?.father?.signature ?? '',
                  name:
                    data.affidavitOfPaternityDetails?.father?.name?.trim() ??
                    '',
                  title:
                    data.affidavitOfPaternityDetails?.father?.title?.trim() ??
                    '',
                },
                mother: {
                  signature:
                    data.affidavitOfPaternityDetails?.mother?.signature ?? '',
                  name:
                    data.affidavitOfPaternityDetails?.mother?.name?.trim() ??
                    '',
                  title:
                    data.affidavitOfPaternityDetails?.mother?.title?.trim() ??
                    '',
                },
                dateSworn:
                  data.affidavitOfPaternityDetails?.dateSworn ?? null,
                adminOfficer: {
                  signature:
                    data.affidavitOfPaternityDetails?.adminOfficer
                      ?.signature ?? '',
                  name:
                    data.affidavitOfPaternityDetails?.adminOfficer?.name?.trim() ??
                    '',
                  position:
                    data.affidavitOfPaternityDetails?.adminOfficer?.position?.trim() ??
                    '',
                },
                ctcInfo: {
                  number:
                    data.affidavitOfPaternityDetails?.ctcInfo?.number?.trim() ??
                    '',
                  dateIssued:
                    data.affidavitOfPaternityDetails?.ctcInfo?.dateIssued ??
                    null,
                  placeIssued:
                    data.affidavitOfPaternityDetails?.ctcInfo?.placeIssued?.trim() ??
                    '',
                },
              }
              : undefined, // Use undefined instead of null

            // Delayed Registration
            isDelayedRegistration: data.isDelayedRegistration,
            affidavitOfDelayedRegistration: data.isDelayedRegistration
              ? {
                affiant: {
                  name:
                    data.affidavitOfDelayedRegistration?.affiant?.name?.trim() ??
                    '',
                  address: {
                    address:
                      data.affidavitOfDelayedRegistration?.affiant?.address?.address?.trim() ??
                      '',
                    cityMunicipality:
                      data.affidavitOfDelayedRegistration?.affiant?.address?.cityMunicipality?.trim() ??
                      '',
                    province:
                      data.affidavitOfDelayedRegistration?.affiant?.address?.province?.trim() ??
                      '',
                    country:
                      data.affidavitOfDelayedRegistration?.affiant?.address?.country?.trim() ??
                      '',
                  },
                  civilStatus:
                    data.affidavitOfDelayedRegistration?.affiant
                      ?.civilStatus ?? '',
                  citizenship:
                    data.affidavitOfDelayedRegistration?.affiant
                      ?.citizenship ?? '',
                },
                registrationType:
                  data.affidavitOfDelayedRegistration?.registrationType ??
                  'SELF',
                parentMaritalStatus:
                  data.affidavitOfDelayedRegistration?.parentMaritalStatus ??
                  'MARRIED',
                reasonForDelay:
                  data.affidavitOfDelayedRegistration?.reasonForDelay?.trim() ??
                  '',
                dateSworn:
                  data.affidavitOfDelayedRegistration?.dateSworn ?? null,
                adminOfficer: {
                  signature:
                    data.affidavitOfDelayedRegistration?.adminOfficer
                      ?.signature ?? '',
                  name:
                    data.affidavitOfDelayedRegistration?.adminOfficer?.name?.trim() ??
                    '',
                  position:
                    data.affidavitOfDelayedRegistration?.adminOfficer?.position?.trim() ??
                    '',
                },
                ctcInfo: {
                  number:
                    data.affidavitOfDelayedRegistration?.ctcInfo?.number?.trim() ??
                    '',
                  dateIssued:
                    data.affidavitOfDelayedRegistration?.ctcInfo
                      ?.dateIssued ?? null,
                  placeIssued:
                    data.affidavitOfDelayedRegistration?.ctcInfo?.placeIssued?.trim() ??
                    '',
                },
              }
              : undefined, // Use undefined instead of null
          },
        },
        receivedBy: data.receivedBy.name.trim(),
        receivedByPosition: data.receivedBy.title.trim(),
        receivedDate: data.receivedBy.date,
        registeredBy: data.registeredByOffice.name.trim(),
        registeredByPosition: data.registeredByOffice.title.trim(),
        registrationDate: data.registeredByOffice.date,
        remarks: data.remarks?.trim(),
      },
    });

    revalidatePath('/civil-registry');
    return {
      success: true,
      data: baseForm,
      message: 'Birth certificate created successfully',
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create birth certificate',
    };
  }
}

export async function checkRegistryNumberExists(
  registryNumber: string,
  formType: FormType
) {
  try {
    if (!registryNumber || !formType) {
      throw new Error(
        'Invalid input. Registry number and form type are required.'
      );
    }

    // Check if the registry number exists
    const existingRegistry = await prisma.baseRegistryForm.findFirst({
      where: {
        registryNumber,
        formType,
      },
    });

    return { exists: !!existingRegistry };
  } catch (error) {
    console.error('Error checking registry number:', error);
    return {
      error: 'Failed to check registry number. Please try again later.',
    };
  }
}
