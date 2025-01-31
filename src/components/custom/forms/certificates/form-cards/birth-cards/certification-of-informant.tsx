'use client';

import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const CertificationOfInformantCard: React.FC = () => {
  const { control } = useFormContext<BirthCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certification of Informant</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Signature */}
        <FormField
          control={control}
          name='informant.signature'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Signature</FormLabel>
              <FormControl>
                <Input placeholder='Signature' {...field} className='h-10' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Name and Relationship */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={control}
            name='informant.name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name in Print</FormLabel>
                <FormControl>
                  <Input placeholder='Enter name' {...field} className='h-10' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='informant.relationship'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relationship to the Child</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter relationship'
                    {...field}
                    className='h-10'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Address */}
        <FormField
          control={control}
          name='informant.address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter complete address'
                  {...field}
                  className='h-10'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Informant Date */}
        <FormField
          control={control}
          name='informant.date'
          render={({ field }) => (
            <DatePickerField
              field={{
                value: field.value,
                onChange: field.onChange,
              }}
              label='Date'
              placeholder='Select date'
            />
          )}
        />
      </CardContent>
    </Card>
  );
};

export default CertificationOfInformantCard;
