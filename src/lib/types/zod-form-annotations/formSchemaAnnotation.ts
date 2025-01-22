import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action';
import { Row } from '@tanstack/react-table';
import { z } from 'zod';

export interface BirthAnnotationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
}

export interface ExtendedBirthAnnotationFormProps
  extends BirthAnnotationFormProps {
  row?: Row<BaseRegistryFormWithRelations>;
}

export interface NameStructure {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  first?: string;
  middle?: string;
  last?: string;
}

export interface PlaceStructure {
  province?: string;
  cityMunicipality?: string;
  barangay?: string;
  hospital?: string;
  toString(): string;
}

export interface MarriagePlace {
  cityMunicipality?: string;
  province?: string;
  church?: string;
}

export interface ParentMarriage {
  date?: string | Date;
  place?: string | MarriagePlace;
}

export interface BirthCertificateForm {
  childName: NameStructure;
  sex: string;
  dateOfBirth: string | Date;
  placeOfBirth: PlaceStructure;
  motherMaidenName: NameStructure;
  motherCitizenship: string;
  fatherName: NameStructure;
  fatherCitizenship: string;
  parentMarriage?: ParentMarriage;
}
export const birthAnnotationSchema = z.object({
  pageNumber: z.string().min(1, 'Page number is required'),
  bookNumber: z.string().min(1, 'Book number is required'),
  registryNumber: z.string().min(1, 'Registry number is required'),
  dateOfRegistration: z.date({
    required_error: 'Registration date is required',
  }),
  childFirstName: z.string().min(1, 'First name is required'),
  childMiddleName: z.string().optional(),
  childLastName: z.string().min(1, 'Last name is required'),
  sex: z.string().min(1, 'Sex is required'),
  dateOfBirth: z.date({
    required_error: 'Date of birth is required',
  }),
  placeOfBirth: z.string().min(1, 'Place of birth is required'),
  motherName: z.string().min(1, "Mother's name is required"),
  fatherName: z.string().min(1, "Father's name is required"),
  motherCitizenship: z.string().min(1, "Mother's citizenship is required"),
  fatherCitizenship: z.string().min(1, "Father's citizenship is required"),
  parentsMarriageDate: z.date({
    required_error: 'Marriage date is required',
  }),
  parentsMarriagePlace: z.string().min(1, 'Marriage place is required'),
  remarks: z.string().optional(),
  preparedBy: z.string().min(1, 'Prepared by is required'),
  preparedByPosition: z.string().min(1, 'Prepared by position is required'),
  verifiedBy: z.string().min(1, 'Verified by is required'),
  verifiedByPosition: z.string().min(1, 'Verified by position is required'),
});

export type BirthAnnotationFormValues = z.infer<typeof birthAnnotationSchema>;

export const deathAnnotationSchema = z.object({
  pageNumber: z.string().min(1, 'Page number is required'),
  bookNumber: z.string().min(1, 'Book number is required'),
  registryNumber: z.string().min(1, 'Registry number is required'),
  dateOfRegistration: z.date({
    required_error: 'Registration date is required',
  }),
  nameOfDeceased: z.string().min(1, 'Name of deceased is required'),
  sex: z.string().min(1, 'Sex is required'),
  age: z.number().min(0, 'Age must be a positive number'),
  civilStatus: z.string().min(1, 'Civil status is required'),
  citizenship: z.string().min(1, 'Citizenship is required'),
  dateOfDeath: z.date({
    required_error: 'Date of death is required',
  }),
  placeOfDeath: z.string().min(1, 'Place of death is required'),
  causeOfDeath: z.string().min(1, 'Cause of death is required'),
  issuedTo: z.string().min(1, 'Issued to is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  remarks: z.string().optional(),
  preparedByName: z.string().min(1, 'Prepared by name is required'),
  preparedByPosition: z.string().min(1, 'Prepared by position is required'),
  verifiedByName: z.string().min(1, 'Verified by name is required'),
  verifiedByPosition: z.string().min(1, 'Verified by position is required'),
  civilRegistrar: z.string().min(1, 'Civil registrar is required'),
  civilRegistrarPosition: z
    .string()
    .min(1, 'Civil registrar position is required'),
  amountPaid: z.number().min(0, 'Amount paid must be a positive number'),
  orNumber: z.string().optional(),
  datePaid: z.date().optional(),
});

export type DeathAnnotationFormValues = z.infer<typeof deathAnnotationSchema>;
export const deathAnnotationDefaultValues: DeathAnnotationFormValues = {
  pageNumber: '1',
  bookNumber: '1',
  registryNumber: 'D-2023-001',
  dateOfRegistration: new Date(),
  nameOfDeceased: 'John Doe',
  sex: 'Male',
  age: 45,
  civilStatus: 'Married',
  citizenship: 'Filipino',
  dateOfDeath: new Date(),
  placeOfDeath: 'City Hospital',
  causeOfDeath: 'Heart Attack',
  issuedTo: 'Jane Doe',
  purpose: 'Legal Purposes',
  remarks: 'N/A',
  preparedByName: 'Clerk Name',
  preparedByPosition: 'Clerk',
  verifiedByName: 'Verifier Name',
  verifiedByPosition: 'Verifier',
  civilRegistrar: 'Registrar Name',
  civilRegistrarPosition: 'Civil Registrar',
  amountPaid: 100,
  orNumber: 'OR-2023-001',
  datePaid: new Date(),
};

export const marriageAnnotationSchema = z.object({
  // Base Form Fields (matching civilRegistryFormBase)
  pageNumber: z.string().min(1, 'Page number is required'),
  bookNumber: z.string().min(1, 'Book number is required'),
  registryNumber: z.string().min(1, 'Registry number is required'),
  dateOfRegistration: z.date({
    required_error: 'Registration date is required',
  }),
  issuedTo: z.string().min(1, 'Issued to is required'),
  purpose: z.string().min(1, 'Purpose is required'),

  // Officials Information
  preparedByName: z.string().min(1, 'Prepared by name is required'),
  preparedByPosition: z.string().min(1, 'Prepared by position is required'),
  verifiedByName: z.string().min(1, 'Verified by name is required'),
  verifiedByPosition: z.string().min(1, 'Verified by position is required'),
  civilRegistrar: z.string().min(1, 'Civil registrar is required'),
  civilRegistrarPosition: z
    .string()
    .min(1, 'Civil registrar position is required'),

  // Payment Information
  amountPaid: z.number().min(0, 'Amount paid must be a positive number'),
  orNumber: z.string().optional(),
  datePaid: z.date().optional(),

  // Marriage Form Specific Fields
  husbandName: z.string().min(1, "Husband's name is required"),
  husbandDateOfBirthAge: z
    .string()
    .min(1, "Husband's Date of Birth/Age is required"),
  husbandCitizenship: z.string().min(1, "Husband's citizenship is required"),
  husbandCivilStatus: z.string().min(1, "Husband's civil status is required"),
  husbandMother: z.string().min(1, "Husband's mother's name is required"),
  husbandFather: z.string().min(1, "Husband's father's name is required"),

  wifeName: z.string().min(1, "Wife's name is required"),
  wifeDateOfBirthAge: z.string().min(1, "Wife's Date of Birth/Age is required"),
  wifeCitizenship: z.string().min(1, "Wife's citizenship is required"),
  wifeCivilStatus: z.string().min(1, "Wife's civil status is required"),
  wifeMother: z.string().min(1, "Wife's mother's name is required"),
  wifeFather: z.string().min(1, "Wife's father's name is required"),

  dateOfMarriage: z.date({
    required_error: 'Marriage date is required',
  }),
  placeOfMarriage: z.string().min(1, 'Place of marriage is required'),
});

export interface MarriageAnnotationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
}

export interface ExtendedMarriageAnnotationFormProps
  extends MarriageAnnotationFormProps {
  row?: Row<BaseRegistryFormWithRelations>;
}

export interface BaseForm {
  id: string;
  preparedBy: {
    name: string;
    id: string;
  };
  verifiedBy: {
    name: string;
    id: string;
  };
  receivedByPosition: string | null;
  registeredByPosition: string | null;
  pageNumber: string;
  bookNumber: string;
  registryNumber: string;
  dateOfRegistration: string | Date;
}

export interface MarriageCertificateForm {
  id: string;
  baseFormId: string;
  husbandFirstName: string;
  husbandMiddleName: string;
  husbandLastName: string;
  husbandDateOfBirth: string | Date;
  husbandAge: number;
  husbandPlaceOfBirth: PlaceStructure;
  husbandSex: string;
  husbandCitizenship: string;
  husbandResidence: string;
  husbandReligion: string;
  husbandCivilStatus: string;
  husbandFatherName: NameStructure;
  husbandMotherMaidenName: NameStructure;
  husbandFatherCitizenship: string;
  husbandMotherCitizenship: string;

  wifeFirstName: string;
  wifeMiddleName: string;
  wifeLastName: string;
  wifeDateOfBirth: string | Date;
  wifeAge: number;
  wifePlaceOfBirth: PlaceStructure;
  wifeSex: string;
  wifeCitizenship: string;
  wifeResidence: string;
  wifeReligion: string;
  wifeCivilStatus: string;
  wifeFatherName: NameStructure;
  wifeMotherMaidenName: NameStructure;
  wifeFatherCitizenship: string;
  wifeMotherCitizenship: string;

  placeOfMarriage: MarriagePlace;
  dateOfMarriage: string | Date;
  timeOfMarriage: string;
  marriageSettlement: boolean;
}

export type MarriageAnnotationFormValues = z.infer<
  typeof marriageAnnotationSchema
>;

// Extended interface with row prop

export const marriageAnnotationDefaultValues: MarriageAnnotationFormValues = {
  pageNumber: '',
  bookNumber: '',
  registryNumber: '',
  dateOfRegistration: new Date(),
  issuedTo: '',
  purpose: '',
  preparedByName: '',
  preparedByPosition: '',
  verifiedByName: '',
  verifiedByPosition: '',
  civilRegistrar: 'PRISCILLA L. GALICIA', // Default value from the form
  civilRegistrarPosition: 'OIC - City Civil Registrar', // Default value from the form
  amountPaid: 0,
  orNumber: '',
  datePaid: new Date(),
  husbandName: '',
  husbandDateOfBirthAge: '',
  husbandCitizenship: '',
  husbandCivilStatus: '',
  husbandMother: '',
  husbandFather: '',
  wifeName: '',
  wifeDateOfBirthAge: '',
  wifeCitizenship: '',
  wifeCivilStatus: '',
  wifeMother: '',
  wifeFather: '',
  dateOfMarriage: new Date(),
  placeOfMarriage: '',
};
