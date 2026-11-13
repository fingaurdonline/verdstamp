'use client';

import { UseFormReturn } from 'react-hook-form';
import { IDVerificationFormData } from '../../../lib/scheme';
import { useState } from 'react';
import Image from 'next/image';

interface UploadIDProps {
  form: UseFormReturn<IDVerificationFormData>;
}

export default function UploadID({ form }: UploadIDProps) {
  const { register, watch, formState: { errors } } = form;
  const [idFrontPreview, setIdFrontPreview] = useState<string>('');
  const [idBackPreview, setIdBackPreview] = useState<string>('');

  const handleFileChange = (field: 'idFront' | 'idBack', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'idFront') {
          setIdFrontPreview(reader.result as string);
        } else {
          setIdBackPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-lnd-fg dark:text-lnd-fg">Upload ID Documents</h2>

      {/* ID Front */}
      <div>
        <label className="block text-lnd-fg-muted dark:text-lnd-fg-muted font-medium mb-3">Upload ID Front</label>
        <div className="relative cursor-pointer rounded-lg border-2 border-dashed border-lnd-accent/25 p-5 text-center transition-colors hover:border-lnd-accent/55 dark:border-lnd-accent/55 dark:hover:border-lnd-accent/55 sm:p-8">
          <input
            type="file"
            {...register('idFront')}
            onChange={(e) => handleFileChange('idFront', e)}
            accept="image/*"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          {idFrontPreview ? (
            <Image src={idFrontPreview || "/placeholder.svg"} alt="ID Front Preview" width={1000} height={1000} className="max-h-32 mx-auto" />
          ) : (
            <>
              <svg className="w-12 h-12 text-lnd-accent dark:text-lnd-accent mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-lnd-accent dark:text-lnd-accent font-medium">Click to Upload</p>
            </>
          )}
        </div>
        {errors.idFront && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-1">{typeof errors.idFront.message === 'string' ? errors.idFront.message : ''}</p>
        )}
      </div>

      {/* ID Back */}
      <div>
        <label className="block text-lnd-fg-muted dark:text-lnd-fg-muted font-medium mb-3">Upload ID Back</label>
        <div className="relative cursor-pointer rounded-lg border-2 border-dashed border-lnd-accent/25 p-5 text-center transition-colors hover:border-lnd-accent/55 dark:border-lnd-accent/55 dark:hover:border-lnd-accent/55 sm:p-8">
          <input
            type="file"
            {...register('idBack')}
            onChange={(e) => handleFileChange('idBack', e)}
            accept="image/*"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          {idBackPreview ? (
            <Image src={idBackPreview || "/placeholder.svg"} alt="ID Back Preview" width={1000} height={1000} className="max-h-32 mx-auto" />
          ) : (
            <>
              <svg className="w-12 h-12 text-lnd-accent dark:text-lnd-accent mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-lnd-accent dark:text-lnd-accent font-medium">Click to Upload</p>
            </>
          )}
        </div>
        {errors.idBack && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-1">{typeof errors.idBack.message === 'string' ? errors.idBack.message : ''}</p>
        )}
      </div>

      {/* Requirements */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mt-6">
        <p className="text-amber-900 dark:text-amber-200 text-sm">
          <span className="font-medium">Support formats:</span> JPG, PNG, PDF
        </p>
        <p className="text-amber-900 dark:text-amber-200 text-sm mt-1">
          <span className="font-medium">Requirements:</span> Documents must be clear, visible, and distinct from background
        </p>
      </div>
    </div>
  );
}