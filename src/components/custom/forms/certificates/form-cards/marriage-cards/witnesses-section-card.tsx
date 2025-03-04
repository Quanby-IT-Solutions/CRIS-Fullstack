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
import { useFieldArray, useFormContext } from 'react-hook-form';
import SignatureUploader from '../shared-components/signature-uploader';
;

interface WitnessesCardProps {
  className?: string;
}

export const WitnessesCard: React.FC<WitnessesCardProps> = ({ className }) => {
  const { control, setValue } = useFormContext<MarriageCertificateFormValues>();
  // Setup field array for husband witnesses
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'husbandWitnesses', // this matches the Zod field
  });

  return (
    <Card className='w-full'>
      <CardHeader className='flex flex-row justify-between items-center'>
        <CardTitle>Marriage Witnesses</CardTitle>
        <button className='bg-chart-1 text-accent p-2 w-24 text-sm rounded-lg' type="button" onClick={() => append({ name: '', signature: '' })}>
          Add Witness
        </button>
      </CardHeader>
      <CardContent className='p-6 space-y-4 w-full'>
        {fields.map((field, index) => (
          <div key={field.id} className="w-full flex flex-row gap-4">
            <div className='flex-1'>
              <FormField
                control={control}
                name={`husbandWitnesses.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Witness Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter witness name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex-1'>
              <FormField
                control={control}
                name={`husbandWitnesses.${index}.signature`}
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <FormControl>
                      <SignatureUploader
                        name={`husbandWitnesses.${index}.signature`}
                        label="Signature"
                        onChange={(value: File | string) => {
                          setValue(
                            `husbandWitnesses.${index}.signature`, // ✅ Correct dynamic field name
                            value,
                            {
                              shouldValidate: true,
                              shouldDirty: true,
                            }
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage>
                      {typeof errors?.husbandWitnesses?.[index]?.signature?.message === "string"
                        ? errors.husbandWitnesses[index].signature.message
                        : ""}
                    </FormMessage>
                  </FormItem>
                )}
              />

            </div>
            {/* You can add additional fields (e.g. name2, signature2) similarly */}
            <button className='border rounded-lg bg-red-500 p-1 text-sm text-accent w-24 flex-none h-10 mt-7' type="button" onClick={() => remove(index)}>
              Remove
            </button>
          </div>
        ))}

      </CardContent>
    </Card>
  );
};

export default WitnessesCard;
