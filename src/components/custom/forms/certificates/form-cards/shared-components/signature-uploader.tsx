'use client';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { CheckCircle2 } from 'lucide-react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface SignatureUploaderProps {
  /**
   * The name of the field for use in your form and Zod schema.
   */
  name: string;
  /**
   * The label for the field.
   */
  label?: string;
  /**
   * Callback to pass the selected file (or base64 string) back to the parent.
   */
  onChange?: (value: File | string) => void;
}

const SignatureUploader: React.FC<SignatureUploaderProps> = ({
  name,
  label = 'Signature',
  onChange,
}) => {
  // Use react-hook-form to watch the value for this field.
  const { watch } = useFormContext();
  const selectedFile = watch(name);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onChange?.(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById(name)?.click();
  };

  const renderPreview = () => {
    // If the selected value is a File, create an object URL.
    if (selectedFile instanceof File) {
      return URL.createObjectURL(selectedFile);
    }
    // If it's a non-empty string, assume it's a base64 image.
    else if (typeof selectedFile === 'string' && selectedFile) {
      return selectedFile;
    }
    return '';
  };

  return (
    <div className='signature-uploader flex flex-col gap-2.5'>
      <label htmlFor={name} className='text-sm'>
        {label}
      </label>
      {/* Hidden file input */}
      <input
        id={name}
        name={name}
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        className='hidden'
      />
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className='relative'>
            <Input
              placeholder={
                selectedFile ? 'Change Signature' : 'Upload Signature'
              }
              readOnly
              onClick={triggerFileInput}
              className='h-10 cursor-pointer pr-10'
            />
            {selectedFile && (
              <span className='absolute inset-y-0 right-2 flex items-center text-green-500'>
                <CheckCircle2 className='w-5 h-5' />
              </span>
            )}
          </div>
        </HoverCardTrigger>
        {selectedFile && (
          <HoverCardContent
            side='top'
            align='center'
            className='p-2 flex items-center justify-center'
          >
            <img
              src={renderPreview()}
              alt='Signature Preview'
              className='w-full h-full object-contain'
            />
          </HoverCardContent>
        )}
      </HoverCard>
    </div>
  );
};

export default SignatureUploader;
