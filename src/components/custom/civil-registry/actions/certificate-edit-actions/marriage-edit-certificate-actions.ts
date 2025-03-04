import { prisma } from "@/lib/prisma";
import { MarriageCertificateFormValues, marriageCertificateSchema } from "@/lib/types/zod-form-certificate/marriage-certificate-form-schema";
import { fileToBase64 } from "@/lib/utils/fileToBase64";
import { Prisma } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";
import { revalidatePath } from 'next/cache';
import { z } from "zod";

export async function updateMarriageCertificateForm(
    id: string, // Only need the ID
    formData: MarriageCertificateFormValues
  ) {
    try {
      if (!id) {
        throw new Error('No ID provided for update');
      }
  
      // Find the existing record to get the baseFormId
      const existingRecord = await prisma.marriageCertificateForm.findUnique({
        where: { id },
        select: { baseFormId: true }
      });
  
      if (!existingRecord || !existingRecord.baseFormId) {
        throw new Error('Marriage certificate not found or missing baseFormId');
      }
  
      const baseFormId = existingRecord.baseFormId;

        if (!formData) {
            throw new Error('No form data provided');
        }

        // Validate the form data against the Zod schema
        try {
            marriageCertificateSchema.parse(formData);
        } catch (validationError) {
            if (validationError instanceof z.ZodError) {
                return {
                    success: false,
                    error: `Validation failed: ${validationError.errors
                        .map((e) => `${e.path.join('.')}: ${e.message}`)
                        .join(', ')}`,
                };
            }
            throw validationError;
        }

        return await prisma.$transaction(
            async (tx) => {
                // Find the user by name
                const preparedByUser = await tx.user.findFirst({
                    where: {
                        name: formData.preparedBy.nameInPrint,
                    },
                });

                if (!preparedByUser) {
                    throw new Error(
                        `No user found with name: ${formData.preparedBy.nameInPrint}`
                    );
                }

                // Find the user for receivedBy and registeredBy
                const receivedByUser = await tx.user.findFirst({
                    where: {
                        name: formData.receivedBy.nameInPrint,
                    },
                });

                const registeredByUser = await tx.user.findFirst({
                    where: {
                        name: formData.registeredByOffice.nameInPrint,
                    },
                });

                if (!receivedByUser || !registeredByUser) {
                    throw new Error('ReceivedBy or RegisteredBy user not found');
                }

                // Use pagination details directly from the form data.
                const pageNumber = formData.pagination?.pageNumber || '';
                const bookNumber = formData.pagination?.bookNumber || '';

                // Determine if the registration is late
                const isLateRegistered = formData.affidavitForDelayed ? true : false;

                // Update the BaseRegistryForm record
                await tx.baseRegistryForm.update({
                    where: { id: baseFormId },
                    data: {
                        pageNumber,
                        bookNumber,
                        province: formData.province,
                        cityMunicipality: formData.cityMunicipality,
                        isLateRegistered,
                        preparedById: preparedByUser.id,
                        preparedByName: formData.preparedBy.nameInPrint,
                        preparedByPosition: formData.preparedBy.titleOrPosition,
                        preparedByDate: formData.preparedBy.date,
                        receivedById: receivedByUser.id,
                        receivedBy: formData.receivedBy.nameInPrint,
                        receivedByPosition: formData.receivedBy.titleOrPosition,
                        receivedByDate: formData.receivedBy.date,
                        registeredById: registeredByUser.id,
                        registeredBy: formData.registeredByOffice.nameInPrint,
                        registeredByPosition: formData.registeredByOffice.titleOrPosition,
                        registeredByDate: formData.registeredByOffice.date,
                        remarks: formData.remarks,
                    },
                });

                // Helper function to convert Date to ISO string for JSON
                const dateToJSON = (date: Date) => date.toISOString();

                // Update the MarriageCertificateForm record
                await tx.marriageCertificateForm.update({
                    where: { id },
                    data: {
                        // Husband Information
                        husbandFirstName: formData.husbandName.first,
                        husbandMiddleName: formData.husbandName.middle,
                        husbandLastName: formData.husbandName.last,
                        husbandAge: formData.husbandAge,
                        husbandDateOfBirth: dateToJSON(formData.husbandBirth || new Date()),
                        husbandSex: formData.husbandSex,
                        husbandCitizenship: formData.husbandCitizenship,
                        husbandResidence: formData.husbandResidence,
                        husbandReligion: formData.husbandReligion || null,
                        husbandCivilStatus: formData.husbandCivilStatus,
                        husbandPlaceOfBirth: formData.husbandPlaceOfBirth as Prisma.JsonObject,

                        // Husband Parents Information
                        husbandFatherName: formData.husbandParents.fatherName as Prisma.JsonObject,
                        husbandFatherCitizenship: formData.husbandParents.fatherCitizenship,
                        husbandMotherMaidenName: formData.husbandParents.motherName as Prisma.JsonObject,
                        husbandMotherCitizenship: formData.husbandParents.motherCitizenship,

                        // Husband Consent Person
                        husbandConsentPerson: {
                            ...formData.husbandConsentPerson,
                            name: formData.husbandConsentPerson.name as Prisma.JsonObject,
                            relationship: formData.husbandConsentPerson.relationship,
                            residence: formData.husbandConsentPerson.residence as Prisma.JsonObject,
                        } as Prisma.JsonObject,

                        // Wife Information
                        wifeFirstName: formData.wifeName.first,
                        wifeMiddleName: formData.wifeName.middle,
                        wifeLastName: formData.wifeName.last,
                        wifeAge: formData.wifeAge,
                        wifeDateOfBirth: dateToJSON(formData.wifeBirth || new Date()),
                        wifeSex: formData.wifeSex,
                        wifeCitizenship: formData.wifeCitizenship,
                        wifeResidence: formData.wifeResidence,
                        wifeReligion: formData.wifeReligion || null,
                        wifeCivilStatus: formData.wifeCivilStatus,
                        wifePlaceOfBirth: formData.wifePlaceOfBirth as Prisma.JsonObject,

                        // Wife Parents Information
                        wifeFatherName: formData.wifeParents.fatherName as Prisma.JsonObject,
                        wifeFatherCitizenship: formData.wifeParents.fatherCitizenship,
                        wifeMotherMaidenName: formData.wifeParents.motherName as Prisma.JsonObject,
                        wifeMotherCitizenship: formData.wifeParents.motherCitizenship,

                        // Wife Consent Person
                        wifeConsentPerson: {
                            ...formData.wifeConsentPerson,
                            name: formData.wifeConsentPerson.name as Prisma.JsonObject,
                            relationship: formData.wifeConsentPerson.relationship,
                            residence: formData.wifeConsentPerson.residence as Prisma.JsonObject,
                        } as Prisma.JsonObject,

                        // Contract Party
                        contractDay: formData.contractDay || new Date(),
                        contractingPartiesSignature: [
                            {
                                party: 'husband',
                                signature: formData.husbandContractParty.signature instanceof File
                                    ? await fileToBase64(formData.husbandContractParty.signature)
                                    : formData.husbandContractParty.signature,
                                agreement: formData.husbandContractParty.agreement,
                            },
                            {
                                party: 'wife',
                                signature: formData.wifeContractParty.signature instanceof File
                                    ? await fileToBase64(formData.wifeContractParty.signature)
                                    : formData.wifeContractParty.signature,
                                agreement: formData.wifeContractParty.agreement,
                            },
                        ] as InputJsonValue[],

                        // Marriage Details
                        placeOfMarriage: formData.placeOfMarriage as Prisma.JsonObject,
                        dateOfMarriage: dateToJSON(formData.dateOfMarriage || new Date()),
                        timeOfMarriage: dateToJSON(formData.timeOfMarriage || new Date()),

                        // Witnesses
                        witnesses: formData.husbandWitnesses as InputJsonValue[],

                        // Solemnizing Officer
                        solemnizingOfficer: formData.solemnizingOfficer as Prisma.JsonObject,

                        // Marriage License Details
                        marriageLicenseDetails: {
                            ...formData.marriageLicenseDetails,
                            licenseNumber: formData.marriageLicenseDetails.licenseNumber,
                            dateIssued: dateToJSON(formData.marriageLicenseDetails.dateIssued || new Date()),
                            placeIssued: formData.marriageLicenseDetails.placeIssued,
                            marriageAgreement: formData.marriageLicenseDetails.marriageAgreement,
                        } as Prisma.JsonObject,

                        // Marriage Article
                        marriageArticle: {
                            ...formData.marriageArticle,
                            marriageArticle: formData.marriageArticle.marriageArticle,
                            article: formData.marriageArticle.article,
                        } as Prisma.JsonObject,

                        marriageSettlement: formData.marriageSettlement,

                        // Registered At Civil Registrar
                        registeredByOffice: {
                            ...formData.registeredByOffice,
                            date: formData.registeredByOffice.date,
                            nameInPrint: formData.registeredByOffice.nameInPrint,
                            signature: formData.registeredByOffice.signature instanceof File
                                ? await fileToBase64(formData.registeredByOffice.signature)
                                : formData.registeredByOffice.signature,
                            title: formData.registeredByOffice.titleOrPosition,
                        } as Prisma.JsonObject,

                        remarks: formData.remarks,

                        // Affidavit of Solemnizing Officer
                        affidavitOfSolemnizingOfficer: {
                            solemnizingOfficerInformation: {
                                officeName: formData.affidavitOfSolemnizingOfficer.solemnizingOfficerInformation.officeName,
                                officerName: formData.affidavitOfSolemnizingOfficer.solemnizingOfficerInformation.officerName as Prisma.JsonObject,
                                address: formData.affidavitOfSolemnizingOfficer.solemnizingOfficerInformation.address,
                                signature: formData.affidavitOfSolemnizingOfficer.solemnizingOfficerInformation.signature instanceof File
                                    ? await fileToBase64(formData.affidavitOfSolemnizingOfficer.solemnizingOfficerInformation.signature)
                                    : formData.affidavitOfSolemnizingOfficer.solemnizingOfficerInformation.signature,
                            } as Prisma.JsonObject,
                            administeringOfficerInformation: {
                                adminName: formData.affidavitOfSolemnizingOfficer.administeringOfficerInformation.adminName as Prisma.JsonObject,
                                address: formData.affidavitOfSolemnizingOfficer.administeringOfficerInformation.address,
                                position: formData.affidavitOfSolemnizingOfficer.administeringOfficerInformation.position,
                                signature: formData.affidavitOfSolemnizingOfficer.administeringOfficerInformation.signature.signature instanceof File
                                    ? await fileToBase64(formData.affidavitOfSolemnizingOfficer.administeringOfficerInformation.signature.signature)
                                    : formData.affidavitOfSolemnizingOfficer.administeringOfficerInformation.signature.signature,
                            } as Prisma.JsonObject,
                            a: {
                                nameOfHusband: formData.affidavitOfSolemnizingOfficer.a?.nameOfHusband as Prisma.JsonObject,
                                nameOfWife: formData.affidavitOfSolemnizingOfficer.a?.nameOfWife as Prisma.JsonObject,
                            } as Prisma.JsonObject,
                            b: {
                                a: formData.affidavitOfSolemnizingOfficer.b.a,
                                b: formData.affidavitOfSolemnizingOfficer.b.b,
                                c: formData.affidavitOfSolemnizingOfficer.b.c,
                                d: formData.affidavitOfSolemnizingOfficer.b.d,
                                e: formData.affidavitOfSolemnizingOfficer.b.e,
                            } as Prisma.JsonObject,
                            c: formData.affidavitOfSolemnizingOfficer.c,
                            d: {
                                dayOf: dateToJSON(formData.affidavitOfSolemnizingOfficer.d.dayOf || new Date()),
                                atPlaceExecute: {
                                    st: formData.affidavitOfSolemnizingOfficer.d.atPlaceExecute.st,
                                    barangay: formData.affidavitOfSolemnizingOfficer.d.atPlaceExecute.barangay,
                                    cityMunicipality: formData.affidavitOfSolemnizingOfficer.d.atPlaceExecute.cityMunicipality,
                                    province: formData.affidavitOfSolemnizingOfficer.d.atPlaceExecute.province,
                                    country: formData.affidavitOfSolemnizingOfficer.d.atPlaceExecute.country,
                                } as Prisma.JsonObject,
                            } as Prisma.JsonObject,
                            dateSworn: {
                                dayOf: dateToJSON(formData.affidavitOfSolemnizingOfficer.dateSworn.dayOf || new Date()),
                                atPlaceOfSworn: {
                                    st: formData.affidavitOfSolemnizingOfficer.dateSworn.atPlaceOfSworn.st,
                                    barangay: formData.affidavitOfSolemnizingOfficer.dateSworn.atPlaceOfSworn.barangay,
                                    cityMunicipality: formData.affidavitOfSolemnizingOfficer.dateSworn.atPlaceOfSworn.cityMunicipality,
                                    province: formData.affidavitOfSolemnizingOfficer.dateSworn.atPlaceOfSworn.province,
                                    country: formData.affidavitOfSolemnizingOfficer.dateSworn.atPlaceOfSworn.country,
                                } as Prisma.JsonObject,
                                ctcInfo: {
                                    number: formData.affidavitOfSolemnizingOfficer.dateSworn.ctcInfo.number,
                                    dateIssued: dateToJSON(formData.affidavitOfSolemnizingOfficer.dateSworn.ctcInfo.dateIssued || new Date()),
                                    placeIssued: formData.affidavitOfSolemnizingOfficer.dateSworn.ctcInfo.placeIssued,
                                } as Prisma.JsonObject,
                            } as Prisma.JsonObject,
                        } as Prisma.JsonObject,

                        // Affidavit of Delayed Registration
                        affidavitOfdelayedRegistration: formData.affidavitForDelayed?.delayedRegistration === 'Yes'
                            ? ({
                                // Same structure as in create function
                                // ...
                            } as Prisma.JsonObject)
                            : Prisma.JsonNull,
                    },
                });

                // Update users' eSignature if needed
                // Similar to create function

                // Revalidate the path for updated content
                revalidatePath('/marriage-certificates');

                return {
                    success: true,
                    message: 'Marriage certificate updated successfully',
                };
            },
            {
                maxWait: 10000,
                timeout: 30000,
            }
        );
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to update marriage certificate form',
        };
    }
}