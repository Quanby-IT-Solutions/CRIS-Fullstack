import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';

// Define a type for the death certificate form structure based on your Prisma model
interface DeathCertificateFormData {
  id?: string;
  baseFormId?: string;
  deceasedName?: any;
  sex?: any;
  dateOfDeath?: Date | string | null;
  timeOfDeath?: Date | string | null;
  dateOfBirth?: Date | string | null;
  ageAtDeath?: any;
  placeOfDeath?: any;
  civilStatus?: string;
  religion?: string;
  citizenship?: string;
  residence?: any;
  occupation?: string;
  parentInfo?: any;
  birthInformation?: any;
  medicalCertificate?: any;
  causesOfDeath19b?: any;
  certificationOfDeath?: any;
  reviewedBy?: any;
  postmortemCertificate?: any;
  embalmerCertification?: any;
  delayedRegistration?: any;
  corpseDisposal?: string;
  burialPermit?: any;
  transferPermit?: any;
  cemeteryOrCrematory?: any;
  informant?: any;
  remarks?: string;
}

// Helper function to map BaseRegistryFormWithRelations to DeathCertificateFormValues
export const mapToDeathCertificateValues = (
  form: BaseRegistryFormWithRelations
): Partial<DeathCertificateFormValues> => {
  const deathForm =
    (form.deathCertificateForm as DeathCertificateFormData) || {};

  // Parse dates safely. If no date is provided, we return undefined.
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

  // Ensure a value is a string, defaulting to '' if null or undefined.
  const ensureString = (value: any): string => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  // Validate civil status values.
  const validateCivilStatus = (
    status: any
  ):
    | 'Single'
    | 'Married'
    | 'Widow'
    | 'Widower'
    | 'Annulled'
    | 'Divorced'
    | undefined => {
    const validStatuses = [
      'Single',
      'Married',
      'Widow',
      'Widower',
      'Annulled',
      'Divorced',
    ];
    if (status && validStatuses.includes(status)) {
      return status as
        | 'Single'
        | 'Married'
        | 'Widow'
        | 'Widower'
        | 'Annulled'
        | 'Divorced';
    }
    return undefined;
  };

  const registryInfo = {
    registryNumber: ensureString(form.registryNumber),
    province: ensureString(form.province),
    cityMunicipality: ensureString(form.cityMunicipality),
    pagination: {
      pageNumber: ensureString(form.pageNumber),
      bookNumber: ensureString(form.bookNumber),
    },
    remarks: ensureString(form.remarks),
  };

  const deceasedInfo = {
    name: deathForm.deceasedName || { first: '', middle: '', last: '' },
    sex:
      deathForm.sex === 'Male' || deathForm.sex === 'Female'
        ? deathForm.sex
        : undefined,

    dateOfDeath: parseDateSafely(deathForm.dateOfDeath), // no fallback to empty string
    timeOfDeath: parseDateSafely(deathForm.timeOfDeath),
    dateOfBirth: parseDateSafely(deathForm.dateOfBirth),
    ageAtDeath: deathForm.ageAtDeath || {
      years: '',
      months: '',
      days: '',
      hours: '',
    },
    placeOfDeath: deathForm.placeOfDeath || {
      hospitalInstitution: '',
      houseNo: '',
      st: '',
      barangay: '',
      cityMunicipality: '',
      province: '',
    },
    civilStatus: validateCivilStatus(deathForm.civilStatus),
    religion: deathForm.religion || '',
    citizenship: deathForm.citizenship || '',
    residence: deathForm.residence || {
      houseNo: '',
      st: '',
      barangay: '',
      cityMunicipality: '',
      province: '',
      country: '',
    },
    occupation: deathForm.occupation || '',
    birthInformation: deathForm.birthInformation || {
      ageOfMother: '',
      methodOfDelivery: 'Normal spontaneous vertex',
      lengthOfPregnancy: ensureString(
        deathForm.birthInformation?.lengthOfPregnancy
      ),
      typeOfBirth: 'Single',
      birthOrder: ensureString(deathForm.birthInformation?.birthOrder),
    },
  };

  const parentInfo = {
    parents: deathForm.parentInfo || {
      fatherName: { first: '', middle: '', last: '' },
      motherName: { first: '', middle: '', last: '' },
    },
  };

  const causesOfDeath = {
    causesOfDeath19b: deathForm.causesOfDeath19b || {
      immediate: { cause: '', interval: '' },
      antecedent: { cause: '', interval: '' },
      underlying: { cause: '', interval: '' },
      otherSignificantConditions: '',
    },
  };

  const medicalCertificateInfo = {
    medicalCertificate: deathForm.medicalCertificate || {
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
  };

  const certificationInfo = {
    certificationOfDeath: deathForm.certificationOfDeath || {
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
      date: parseDateSafely(deathForm.certificationOfDeath?.date), // keep as Date | undefined
      healthOfficerSignature: '',
      healthOfficerNameInPrint: '',
    },
    reviewedBy: deathForm.reviewedBy || {
      signature: '',
      date: parseDateSafely(deathForm.reviewedBy?.date),
    },
    postmortemCertificate: deathForm.postmortemCertificate,
    embalmerCertification: deathForm.embalmerCertification,
    delayedRegistration: deathForm.delayedRegistration,
  };

  const disposalInfo = {
    corpseDisposal: deathForm.corpseDisposal || '',
    burialPermit: deathForm.burialPermit || {
      number: '',
      dateIssued: parseDateSafely(deathForm.burialPermit?.dateIssued),
    },
    transferPermit: deathForm.transferPermit,
    cemeteryOrCrematory: deathForm.cemeteryOrCrematory || {
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
  };

  const informantInfo = {
    informant: deathForm.informant || {
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
      date: parseDateSafely(deathForm.informant?.date),
    },
  };

  const preparedBySignature =
    form.preparedBy &&
    typeof form.preparedBy === 'object' &&
    'eSignature' in form.preparedBy &&
    form.preparedBy.eSignature
      ? ensureString((form.preparedBy as { eSignature?: string }).eSignature)
      : '';

  const preparedByNameResolved =
    typeof form.preparedBy === 'string'
      ? form.preparedBy
      : form.preparedByName
      ? ensureString(form.preparedByName)
      : form.preparedBy && form.preparedBy.name
      ? ensureString(form.preparedBy.name)
      : '';

  // Now for receivedBy:
  const receivedByNameResolved =
    typeof form.receivedBy === 'string'
      ? form.receivedBy ?? ''
      : (form as any).receivedByUser && 'name' in (form as any).receivedByUser
      ? ensureString((form as any).receivedByUser.name)
      : ensureString(form.receivedBy);

  const receivedBySignature =
    (form as any).receivedByUser &&
    typeof (form as any).receivedByUser === 'object' &&
    'eSignature' in (form as any).receivedByUser &&
    (form as any).receivedByUser.eSignature
      ? ensureString((form as any).receivedByUser.eSignature)
      : receivedByNameResolved === preparedByNameResolved
      ? preparedBySignature
      : '';

  // And similarly for registeredBy:
  const registeredByNameResolved =
    typeof form.registeredBy === 'string'
      ? form.registeredBy ?? ''
      : (form as any).registeredByUser &&
        'name' in (form as any).registeredByUser
      ? ensureString((form as any).registeredByUser.name)
      : ensureString(form.registeredBy);

  const registeredBySignature =
    (form as any).registeredByUser &&
    typeof (form as any).registeredByUser === 'object' &&
    'eSignature' in (form as any).registeredByUser &&
    (form as any).registeredByUser.eSignature
      ? ensureString((form as any).registeredByUser.eSignature)
      : registeredByNameResolved === preparedByNameResolved
      ? preparedBySignature
      : '';

  const processingInfo = {
    preparedBy: {
      signature: preparedBySignature,
      nameInPrint: preparedByNameResolved,
      titleOrPosition: ensureString(form.preparedByPosition),
      date: parseDateSafely(form.preparedByDate),
    },
    receivedBy: {
      signature: receivedBySignature,
      nameInPrint: receivedByNameResolved,
      titleOrPosition: ensureString(form.receivedByPosition),
      date: parseDateSafely(form.receivedByDate),
    },
    registeredByOffice: {
      signature: registeredBySignature,
      nameInPrint: registeredByNameResolved,
      titleOrPosition: ensureString(form.registeredByPosition),
      date: parseDateSafely(form.registeredByDate),
    },
  };

  return {
    ...registryInfo,
    ...deceasedInfo,
    ...parentInfo,
    ...causesOfDeath,
    ...medicalCertificateInfo,
    ...certificationInfo,
    ...disposalInfo,
    ...informantInfo,
    ...processingInfo,
  };
};
