import { z } from 'zod';
import {
  citizenshipSchema,
  cityMunicipalitySchema,
  createDateFieldSchema,
  nameSchema,
  parentInfoSchema,
  processingDetailsSchema,
  provinceSchema,
  registryNumberSchema,
  religionSchema,
  remarksAnnotationsSchema,
  residenceSchema,
} from './form-certificates-shared-schema';

// --- Deceased Information Schema ---
const deceasedInformationSchema = z.object({
  name: nameSchema, // Reusing shared name schema
  sex: z
    .preprocess(
      (val) => (val === '' ? undefined : val),
      z.enum(['Male', 'Female']).optional()
    )
    .refine((val) => val !== undefined, {
      message: 'Sex is required',
    }),
  dateOfDeath: createDateFieldSchema({
    requiredError: 'Date of death is required',
    futureError: 'Date of death cannot be in the future',
  }),
  // Time of death can remain a string (e.g., "HH:MM")
  timeOfDeath: z.preprocess((val) => {
    if (typeof val === 'string' && val.trim() !== '') {
      // Assume the time string is in "HH:MM" format.
      const [hours, minutes] = val.split(':');
      const date = new Date();
      date.setHours(Number(hours), Number(minutes), 0, 0);
      return date;
    }
    return val;
  }, z.date({ required_error: 'Time of death is required' })),
  dateOfBirth: createDateFieldSchema({
    requiredError: 'Date of birth is required',
    futureError: 'Date of birth cannot be in the future',
  }),
  ageAtDeath: z.object({
    years: z.string().optional(),
    months: z.string().optional(),
    days: z.string().optional(),
    hours: z.string().optional(),
  }),
  placeOfDeath: residenceSchema,
  civilStatus: z.string().nonempty('Civil status is required'),
  religion: religionSchema,
  citizenship: citizenshipSchema,
  residence: residenceSchema,
  occupation: z.string().nonempty('Occupation is required'),
});

// --- Medical Certificate Schema ---
const medicalCertificateSchema = z.object({
  // For infants (0-7 days) — optional details
  infantDeathDetails: z
    .object({
      ageOfMother: z.string().nonempty('Age of mother is required'),
      methodOfDelivery: z.string().nonempty('Method of delivery is required'),
      lengthOfPregnancy: z.string().nonempty('Length of pregnancy is required'),
      typeOfBirth: z.string().nonempty('Type of birth is required'),
      multipleBirthOrder: z.string().optional(),
    })
    .optional(),

  // Causes of death — choose infant or regular details
  causesOfDeath: z.union([
    // Infant-style cause of death
    z.object({
      mainDiseaseOfInfant: z
        .string()
        .nonempty('Main disease/condition is required'),
      otherDiseasesOfInfant: z.string().optional(),
      mainMaternalDisease: z.string().optional(),
      otherMaternalDisease: z.string().optional(),
      otherRelevantCircumstances: z.string().optional(),
    }),
    // Standard cause of death
    z.object({
      immediate: z.object({
        cause: z.string().nonempty('Immediate cause is required'),
        interval: z.string().nonempty('Interval is required'),
      }),
      antecedent: z.object({
        cause: z.string().optional(),
        interval: z.string().optional(),
      }),
      underlying: z.object({
        cause: z.string().optional(),
        interval: z.string().optional(),
      }),
      otherSignificantConditions: z.string().optional(),
    }),
  ]),

  // Maternal condition (optional)
  maternalCondition: z
    .object({
      pregnantNotInLabor: z.boolean().optional(),
      pregnantInLabor: z.boolean().optional(),
      lessThan42Days: z.boolean().optional(),
      daysTo1Year: z.boolean().optional(),
      noneOfTheAbove: z.boolean().optional(),
    })
    .optional(),

  // External causes (optional)
  externalCauses: z.object({
    mannerOfDeath: z.string().optional(),
    placeOfOccurrence: z.string().optional(),
  }),

  // Attendant details (ENUM approach)
  attendant: z
    .object({
      type: z
        .preprocess(
          (val) => (val === '' ? undefined : val), // Treat empty string as undefined
          z
            .enum([
              'PRIVATE_PHYSICIAN',
              'PUBLIC_HEALTH_OFFICER',
              'HOSPITAL_AUTHORITY',
              'NONE',
              'OTHERS',
            ])
            .optional() // Enum with optional value
        )
        .refine((val) => val !== undefined, {
          message: 'Please select an attendant type', // User-friendly error message
        }),
      othersSpecify: z.string().optional(),
      duration: z
        .object({
          from: createDateFieldSchema({
            requiredError: 'Start date is required',
            futureError: 'Start date cannot be in the future',
          }),
          to: createDateFieldSchema({
            requiredError: 'End date is required',
            futureError: 'End date cannot be in the future',
          }),
        })
        .optional(),
    })
    .superRefine((data, ctx) => {
      // If "OTHERS" is selected, must specify
      if (data.type === 'OTHERS' && !data.othersSpecify) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please specify the other attendant type',
          path: ['othersSpecify'],
        });
      }

      // If type is not "NONE", duration should be provided
      if (data.type !== 'NONE') {
        if (!data.duration || !data.duration.from || !data.duration.to) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please provide the duration for the selected attendant',
            path: ['duration'],
          });
        }
      }

      // If both dates are present, ensure `to` >= `from`
      if (
        data.duration?.from &&
        data.duration?.to &&
        new Date(data.duration.to) < new Date(data.duration.from)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End date must be after start date',
          path: ['duration', 'to'],
        });
      }
    }),

  autopsy: z.boolean().default(false),
});

// --- Certification of Death Schema ---
const certificationOfDeathSchema = z.object({
  hasAttended: z.boolean(),
  signature: z.string().nonempty('Signature is required'),
  nameInPrint: z.string().nonempty('Name is required'),
  titleOfPosition: z.string().nonempty('Title/Position is required'),
  address: residenceSchema,
  date: createDateFieldSchema({
    requiredError: 'Certification date is required',
    futureError: 'Certification date cannot be in the future',
  }),
  healthOfficerSignature: z
    .string()
    .nonempty('Health officer signature is required'),
  healthOfficerNameInPrint: z
    .string()
    .nonempty('Health officer name is required'),
});

// --- Review Schema ---
const reviewSchema = z.object({
  signature: z.string().nonempty('Signature is required'),
  date: createDateFieldSchema({
    requiredError: 'Review date is required',
    futureError: 'Review date cannot be in the future',
  }),
});

// --- Certificates Schemas ---
const postmortemCertificateSchema = z
  .object({
    causeOfDeath: z.string().nonempty('Cause of death is required'),
    signature: z.string().nonempty('Signature is required'),
    nameInPrint: z.string().nonempty('Name is required'),
    date: createDateFieldSchema({
      requiredError: 'Postmortem date is required',
      futureError: 'Postmortem date cannot be in the future',
    }),
    titleDesignation: z.string().nonempty('Title/Designation is required'),
    address: z.string().nonempty('Address is required'),
  })
  .optional();

const embalmerCertificationSchema = z
  .object({
    nameOfDeceased: z.string().nonempty('Name of deceased is required'),
    signature: z.string().nonempty('Signature is required'),
    nameInPrint: z.string().nonempty('Name is required'),
    address: z.string().nonempty('Address is required'),
    titleDesignation: z.string().nonempty('Title/Designation is required'),
    licenseNo: z.string().nonempty('License number is required'),
    issuedOn: z.string().nonempty('Issue date is required'),
    issuedAt: z.string().nonempty('Issue location is required'),
    expiryDate: z.string().nonempty('Expiry date is required'),
  })
  .optional();

const delayedRegistrationSchema = z
  .object({
    affiant: z.object({
      name: z.string().nonempty('Name is required'),
      civilStatus: z.enum([
        'Single',
        'Married',
        'Divorced',
        'Widow',
        'Widower',
      ]),
      residenceAddress: z.string().nonempty('Address is required'),
    }),
    deceased: z.object({
      name: z.string().nonempty('Name is required'),
      dateOfDeath: z.string().nonempty('Date of death is required'),
      placeOfDeath: z.string().nonempty('Place of death is required'),
      burialInfo: z.object({
        date: z.string().nonempty('Burial date is required'),
        place: z.string().nonempty('Burial place is required'),
      }),
    }),
    attendance: z.object({
      wasAttended: z.boolean(),
      attendedBy: z.string().optional(),
    }),
    causeOfDeath: z.string().nonempty('Cause of death is required'),
    reasonForDelay: z.string().nonempty('Reason for delay is required'),
    affidavitDate: z.object({
      day: z.string().nonempty('Day is required'),
      month: z.string().nonempty('Month is required'),
      year: z.string().nonempty('Year is required'),
      place: z.string().nonempty('Place is required'),
    }),
    adminOfficer: z.object({
      signature: z.string().nonempty('Signature is required'),
      position: z.string().nonempty('Position is required'),
    }),
    ctcInfo: z.object({
      number: z.string().nonempty('CTC number is required'),
      issuedOn: z.string().nonempty('Date issued is required'),
      issuedAt: z.string().nonempty('Place issued is required'),
    }),
  })
  .optional();

// --- Disposal Information Schema ---
const disposalInformationSchema = z.object({
  corpseDisposal: z.string().nonempty('Corpse disposal method is required'),
  burialPermit: z.object({
    number: z.string().nonempty('Permit number is required'),
    dateIssued: createDateFieldSchema({
      requiredError: 'Burial permit date is required',
      futureError: 'Burial permit date cannot be in the future',
    }),
  }),
  transferPermit: z
    .object({
      number: z.string().optional(),
      dateIssued: z.string().optional(),
    })
    .optional(),
  cemeteryOrCrematory: z.object({
    name: z.string().nonempty('Name is required'),
    address: residenceSchema,
  }),
});

// --- Informant Schema ---
const informantSchema = z.object({
  signature: z.string().nonempty('Signature is required'),
  nameInPrint: z.string().nonempty('Name is required'),
  relationshipToDeceased: z.string().nonempty('Relationship is required'),
  address: residenceSchema,
  date: createDateFieldSchema({
    requiredError: 'Informant date is required',
    futureError: 'Informant date cannot be in the future',
  }),
});

// Zod schema for Section 19b - Causes of Death (8 days and over)
const causesOfDeath19bSchema = z.object({
  immediate: z.object({
    cause: z.string().nonempty('Immediate cause is required'),
    interval: z.string().nonempty('Interval is required'),
  }),
  antecedent: z.object({
    cause: z.string().optional(),
    interval: z.string().optional(),
  }),
  underlying: z.object({
    cause: z.string().optional(),
    interval: z.string().optional(),
  }),
  otherSignificantConditions: z.string().optional(),
});

// --- Main Death Certificate Schema ---
export const deathCertificateFormSchema = z
  .object({
    // Header Information
    registryNumber: registryNumberSchema,
    province: provinceSchema,
    cityMunicipality: cityMunicipalitySchema,

    // Deceased Information
    ...deceasedInformationSchema.shape,

    // Parent Information
    parents: parentInfoSchema,

    // Causes of Death 19b
    causesOfDeath19b: causesOfDeath19bSchema,

    // Medical Certificate
    medicalCertificate: medicalCertificateSchema,

    // Certification of Death
    certificationOfDeath: certificationOfDeathSchema,

    // Review
    reviewedBy: reviewSchema,

    // Certificates
    postmortemCertificate: postmortemCertificateSchema,
    embalmerCertification: embalmerCertificationSchema,
    delayedRegistration: delayedRegistrationSchema,

    // Disposal Information
    ...disposalInformationSchema.shape,

    // Informant
    informant: informantSchema,

    // Processing Information
    preparedBy: processingDetailsSchema.shape.preparedBy,
    receivedBy: processingDetailsSchema.shape.receivedBy,
    registeredByOffice: processingDetailsSchema.shape.registeredBy,

    // Additional Remarks
    remarks: remarksAnnotationsSchema,
  })
  .superRefine((data, ctx) => {
    // 1. If the deceased is an infant (based on ageAtDeath.days) ensure infantDeathDetails are provided
    if (data.ageAtDeath.days && parseInt(data.ageAtDeath.days) <= 7) {
      if (!data.medicalCertificate.infantDeathDetails) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Infant details are required for deaths within 7 days of birth',
          path: ['medicalCertificate', 'infantDeathDetails'],
        });
      }
    }

    // 2. For females of reproductive age, maternal condition is required.
    if (data.sex === 'Female' && data.ageAtDeath.years) {
      const age = parseInt(data.ageAtDeath.years);
      if (
        age >= 15 &&
        age <= 49 &&
        !data.medicalCertificate.maternalCondition
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Maternal condition is required for females aged 15-49',
          path: ['medicalCertificate', 'maternalCondition'],
        });
      }
    }

    // 3. If autopsy is performed, postmortem certificate must be provided.
    if (data.medicalCertificate.autopsy && !data.postmortemCertificate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Postmortem certificate is required when autopsy is performed',
        path: ['postmortemCertificate'],
      });
    }

    // 4. Validate transfer permit requirement when burial location differs from place of death.
    if (
      data.placeOfDeath.cityMunicipality !==
        data.cemeteryOrCrematory.address.cityMunicipality &&
      !data.transferPermit
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Transfer permit is required when burial location differs from place of death',
        path: ['transferPermit'],
      });
    }
  });

// Export the Type
export type DeathCertificateFormValues = z.infer<
  typeof deathCertificateFormSchema
>;

// Props interface (optional)
export interface DeathCertificateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
}
