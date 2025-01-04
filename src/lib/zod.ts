// src\lib\zod.ts
import { object, string, z } from 'zod';

// Helper functions for schema validation
const getPasswordSchema = (type: 'password' | 'confirmPassword') =>
  string({ required_error: `${type} is required` })
    .min(8, 'Password must be at least 8 characters long')
    .max(32, 'Password must be less than 32 characters');

const getEmailSchema = () =>
  string({ required_error: `Email is required` })
    .email('Invalid email address')
    .min(1, 'Email must be at least 1 character long')
    .max(32, 'Email must be less than 32 characters');

const getNameSchema = () =>
  string({ required_error: `Name is required` })
    .min(1, 'Name must be at least 1 character long')
    .max(32, 'Name must be less than 32 characters');

// Sign-up schema
export const signUpSchema = object({
  email: getEmailSchema(),
  password: getPasswordSchema('password'),
  confirmPassword: getPasswordSchema('confirmPassword'),
  name: getNameSchema(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Sign-in schema
export const signInSchema = object({
  email: getEmailSchema(),
  password: getPasswordSchema('password'),
});

// Registration schema with profile and attachment
export const registrationSchema = object({
  // Basic info
  email: getEmailSchema(),
  name: getNameSchema(),
  password: getPasswordSchema('password'),
  confirmPassword: getPasswordSchema('confirmPassword'),

  // Profile
  dateOfBirth: string({ required_error: 'Date of birth is required' }),
  phoneNumber: string({ required_error: 'Phone number is required' }).min(
    10,
    'Phone number must be at least 10 digits'
  ),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select a gender',
  }),

  // Address
  address: string({ required_error: 'Address is required' }),
  city: string({ required_error: 'City is required' }),
  state: string({ required_error: 'State is required' }),
  country: string({ required_error: 'Country is required' }),
  postalCode: string({ required_error: 'Postal code is required' }),

  // Additional info
  occupation: string({ required_error: 'Occupation is required' }),
  nationality: string({ required_error: 'Nationality is required' }),

  // Attachment
  attachmentType: z.enum(
    ['BIRTH_CERTIFICATE', 'DEATH_CERTIFICATE', 'MARRIAGE_CERTIFICATE'],
    {
      required_error: 'Please select a document type',
    }
  ),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Type inference for forms
export type SignUpForm = z.infer<typeof signUpSchema>;
export type SignInForm = z.infer<typeof signInSchema>;
export type RegistrationForm = z.infer<typeof registrationSchema>;
