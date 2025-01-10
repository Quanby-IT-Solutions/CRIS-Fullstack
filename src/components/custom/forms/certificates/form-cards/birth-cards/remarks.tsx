import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const RemarksCard: React.FC = () => {
  const { control } = useFormContext<BirthCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Remarks/Annotations</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Remarks/Annotations Field */}
        <FormField
          control={control}
          name='remarks'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder='Enter remarks or annotations'
                  className='min-h-[100px]'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default RemarksCard;
