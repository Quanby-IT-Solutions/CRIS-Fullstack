'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/marriage-certificate-form-schema';

;
import { useFormContext } from 'react-hook-form';

const HusbandParentsInfoCard: React.FC = () => {
  const { control } = useFormContext<MarriageCertificateFormValues>();

  return (
    <Card className='border dark:border-border'>
      <CardHeader>
        <CardTitle>Husband&apos;s Parents Information</CardTitle>
      </CardHeader>
      <CardContent className='p-6 space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Father's First Name */}
          <FormField
            control={control}
            name='husbandInfo.husbandParents.father.first'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father&apos;s First Name</FormLabel>
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
          {/* Father's Middle Name */}
          <FormField
            control={control}
            name='husbandInfo.husbandParents.father.middle'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father&apos;s Middle Name</FormLabel>
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
          {/* Father's Last Name */}
          <FormField
            control={control}
            name='husbandInfo.husbandParents.father.last'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father&apos;s Last Name</FormLabel>
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
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Maiden Mother's First Name */}
          <FormField
            control={control}
            name='husbandInfo.husbandParents.mother.first'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother&apos;s First Name</FormLabel>
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
          {/* Maiden Mother's Middle Name */}
          <FormField
            control={control}
            name='husbandInfo.husbandParents.mother.middle'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother&apos;s Middle Name</FormLabel>
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
          {/* Maiden Mother's last Name */}
          <FormField
            control={control}
            name='husbandInfo.husbandParents.mother.last'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother&apos;s (Maiden) Name</FormLabel>
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
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Father's Citizenship */}
          <FormField
            control={control}
            name='husbandInfo.husbandParents.fatherCitizenship'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father&apos;s Citizenship</FormLabel>
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
          {/* Mother's Citizenship */}
          <FormField
            control={control}
            name='husbandInfo.husbandParents.motherCitizenship'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother&apos;s Citizenship</FormLabel>
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
        </div>

        {/* Adviser */}
        <div className='col-span-full py-12'>
          <h3 className='font-bold '>Name of person Wali who gave consent or advise</h3>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <FormField
            control={control}
            name='husbandInfo.husbandConsentPerson.first'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adviser (First Name)</FormLabel>
                <FormControl>
                  <Input type='text'
                    className='h-10'
                    placeholder='Enter Adviser (first)'
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='husbandInfo.husbandConsentPerson.middle'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adviser (Middle Name)</FormLabel>
                <FormControl>
                  <Input type='text'
                    className='h-10'
                    placeholder='Enter Adviser (middle)'
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='husbandInfo.husbandConsentPerson.last'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adviser (Last Name)</FormLabel>
                <FormControl>
                  <Input type='text'
                    className='h-10'
                    placeholder='Enter Adviser (last)'
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>



        {/* Parents Residence */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Parents Relationship */}
          <FormField
            control={control}
            name='husbandInfo.husbandConsentPerson.relationship'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relationship</FormLabel>
                <FormControl>
                  <Input type='text'
                    className='h-10'
                    placeholder='Enter relationship'
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='husbandInfo.husbandConsentPerson.residence'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Residence</FormLabel>
                <FormControl>
                  <Input type='text'
                    className='h-10'
                    placeholder='House No., St., Barangay, City/Municipality, Province, Country'
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
    </Card >
  );
};

export default HusbandParentsInfoCard;
