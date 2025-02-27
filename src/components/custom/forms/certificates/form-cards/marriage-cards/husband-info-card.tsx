'use client'
import React, { useState, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';
import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/marriage-certificate-form-schema';
import NCRModeSwitch from '../shared-components/ncr-mode-switch';
import LocationSelector from '../shared-components/location-selector';

const HusbandInfoCard: React.FC = () => {
  const { control, setValue } = useFormContext<MarriageCertificateFormValues>();
  const [ncrMode, setncrMode] = useState(false);

  // Auto-calculate and set age when birthdate changes
  const birthDate = useWatch({ control, name: 'husbandBirth' });

  useEffect(() => {
    if (birthDate) {
      const birth = new Date(birthDate);
      const today = new Date();

      let age = today.getFullYear() - birth.getFullYear();

      // Check if the birth month and day have not yet occurred in the current year
      const isBirthdayNotPassed =
        today.getMonth() < birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());

      if (isBirthdayNotPassed) {
        age -= 1; // Subtract 1 year if the birthday hasn't occurred yet this year
      }

      setValue('husbandAge', age); // Update the age field
    }
  }, [birthDate, setValue]);

  return (
    <Card className='border dark:border-border'>
      <CardHeader>
        <CardTitle>Husband&apos;s Information</CardTitle>
      </CardHeader>
      <CardContent className='p-6 space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4'>
          {/* First Name */}
          <FormField
            control={control}
            name='husbandName.first'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input type='text'
                    className='h-10'
                    placeholder='Enter first name'
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Middle Name */}
          <FormField
            control={control}
            name='husbandName.middle'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input type='text'
                    className='h-10'
                    placeholder='Enter middle name'
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Last Name */}
          <FormField
            control={control}
            name='husbandName.last'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input type='text'
                    className='h-10'
                    placeholder='Enter last name'
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4'>
          {/* Sex */}
          <FormField
            control={control}
            name='husbandSex'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sex</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || 'Male'}
                >
                  <FormControl>
                    <SelectTrigger className='h-10'>
                      <SelectValue placeholder='Select sex' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='Female'>Female</SelectItem>
                    <SelectItem value='Male'>Male</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Date of Birth */}
          <FormField
            control={control}
            name='husbandBirth'
            render={({ field }) => (
              <DatePickerField
                field={{
                  value: field.value || '',
                  onChange: field.onChange,
                }}
                ref={field.ref}
                label='Date of Birth'
                placeholder='Select date of birth'
              />
            )}
          />
          {/* Age - Auto-filled */}
          <FormField
            control={control}
            name='husbandAge'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input className='h-10' type='number' placeholder='Enter age' {...field}
                    value={field.value ?? ''} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          {/* Citizenship */}
          <FormField
            control={control}
            name='husbandCitizenship'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Citizenship</FormLabel>
                <FormControl>
                  <Input type='text'
                    className='h-10'
                    placeholder='Enter citizenship'
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Religion */}
          <FormField
            control={control}
            name='husbandReligion'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Religion/Religious Sect</FormLabel>
                <FormControl>
                  <Input type='text'
                    className='h-10'
                    placeholder='Enter religion'
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Civil Status */}
          <FormField
            control={control}
            name='husbandCivilStatus'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Civil Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className='h-10'>
                      <SelectValue placeholder='Select civil status' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='Single'>Single</SelectItem>
                    <SelectItem value='Widowed'>Widowed</SelectItem>
                    <SelectItem value='Divorced'>Divorced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Place of Birth */}

        <div className='col-span-1 md:col-span-3'>
          <NCRModeSwitch isNCRMode={ncrMode} setIsNCRMode={setncrMode} />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4'>
          {/* Place of Birth */}
          <LocationSelector
            provinceFieldName='husbandhusbandPlaceOfBirth.province'
            municipalityFieldName='husbandPlaceOfBirth.cityMunicipality'
            barangayFieldName='husbandPlaceOfBirth.barangay'
            provinceLabel='Province'
            municipalityLabel='City/Municipality'
            barangayLabel='Barangay'
            isNCRMode={ncrMode}
            showBarangay={true}
            provincePlaceholder='Select province'
            municipalityPlaceholder='Select city/municipality'
            barangayPlaceholder='Select barangay'
          />
          <FormField
            control={control}
            name='husbandPlaceOfBirth.country'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input type='text' className='h-10' placeholder='Enter complete address' {...field}
                    value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Residence */}
          <FormField
            control={control}
            name='husbandResidence'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street</FormLabel>
                <FormControl>
                  <Input type='text'
                    className='h-10'
                    placeholder='Enter complete address'
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

      </CardContent>
    </Card>
  );
};

export default HusbandInfoCard;
