'use client';

import * as React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { format } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/marriage-certificate-form-schema';
import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';
import SignatureUploader from '../shared-components/signature-uploader';

interface ContractingPartiesCertificationProps {
  className?: string;
}

export const ContractingPartiesCertification: React.FC<
  ContractingPartiesCertificationProps
> = ({ className }) => {
  const { control, setValue } = useFormContext<MarriageCertificateFormValues>();

  // Watch contractDay field
  const contractDay = useWatch({ control, name: 'contractDay' });

  // Format contractDay into "day" and "month + year"
  const formattedDay = contractDay ? format(new Date(contractDay), 'd') : '';
  const formattedMonthYear = contractDay
    ? format(new Date(contractDay), 'MMMM yyyy')
    : '';

  return (
    <Card className={cn('border dark:border-border', className)}>
      <CardHeader>
        <CardTitle>Certification of the Contracting Parties</CardTitle>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='space-y-6'>
          {/* Certification Text */}
          <div className='text-sm text-muted-foreground border-b pb-4'>
            <p className='leading-relaxed'>THIS IS TO CERTIFY That I</p>
            <p className='mt-2 leading-relaxed'>
              of my own free will and accord and in the presence of the person
              solemnizing this marriage and of the witnesses named below, take
              each other as husband and wife and certify further that we have
              signed (marked with our fingerprints) this certificate in
              quadruplicate this <span className=' px-5 border-b border-muted-foreground text-muted-foreground'>{formattedDay}</span> day of{' '}
              <span className=' px-5 border-b border-muted-foreground text-muted-foreground'>{formattedMonthYear}</span>.
            </p>
          </div>


          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Date of Marriage */}
            <div className='flex-1'>
              <FormField
                control={control}
                name='contractDay'
                render={({ field }) => (
                  <DatePickerField field={{
                    value: field.value || '',
                    onChange: field.onChange,
                  }}
                    label='Date of Marriage'
                    ref={field.ref} // Forward ref for auto-focus
                    placeholder='Select date of marriage'
                  />
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={control}
                name='husbandContractParty.signature'
                render={({ field, formState: { errors } }) => (
                  <FormItem>

                    <FormControl>
                      <SignatureUploader
                        name='husbandContractParty.signature'
                        label='Signature of Husband'
                        onChange={(value: File | string) => {
                          if (value instanceof File) {
                            setValue('husbandContractParty.signature', value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          } else {
                            setValue('husbandContractParty.signature', value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage>
                      {typeof errors?.husbandContractParty?.signature?.message === 'string'
                        ? errors?.husbandContractParty?.signature?.message
                        : ''}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={control}
                name='wifeContractParty.signature'
                render={({ field, formState: { errors } }) => (
                  <FormItem>

                    <FormControl>
                      <SignatureUploader
                        name='wifeContractParty.signature'
                        label='Signature of Wife'
                        onChange={(value: File | string) => {
                          if (value instanceof File) {
                            setValue('wifeContractParty.signature', value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          } else {
                            setValue('wifeContractParty.signature', value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage>
                      {typeof errors?.wifeContractParty?.signature?.message === 'string'
                        ? errors?.wifeContractParty?.signature?.message
                        : ''}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractingPartiesCertification;
