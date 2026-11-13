'use client';

import { UseFormReturn } from 'react-hook-form';
import { IDVerificationFormData } from '../../../lib/scheme';
import { useState } from 'react';
import Image from 'next/image';

interface FaceRecognitionProps {
  form: UseFormReturn<IDVerificationFormData>;
}

export default function FaceRecognition({ form }: FaceRecognitionProps) {
  const { register, formState: { errors } } = form;
  const [selfiePreview, setSelfiePreview] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfiePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-lnd-fg dark:text-lnd-fg">Face Recognition</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Selfie */}
        <div>
          <label className="block text-lnd-fg-muted dark:text-lnd-fg-muted font-medium mb-3">Upload Selfie</label>
          <div className="relative cursor-pointer rounded-lg border-2 border-dashed border-lnd-accent/25 p-5 text-center transition-colors hover:border-lnd-accent/55 dark:border-lnd-accent/55 dark:hover:border-lnd-accent/55 sm:p-8">
            <input
              type="file"
              {...register('selfie')}
              onChange={handleFileChange}
              accept="image/*"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            {selfiePreview ? (
              <Image src={selfiePreview || "/placeholder.svg"} alt="Selfie Preview" width={1000} height={1000} className="max-h-40 mx-auto rounded" />
            ) : (
              <>
                <svg className="w-12 h-12 text-lnd-accent dark:text-lnd-accent mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-lnd-accent dark:text-lnd-accent font-medium">Take Selfie</p>
              </>
            )}
          </div>
          {errors.selfie && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{typeof errors.selfie.message === 'string' ? errors.selfie.message : ''}</p>
          )}
        </div>

        {/* Selfie Example */}
        <div>
          <label className="block text-lnd-fg-muted dark:text-lnd-fg-muted font-medium mb-3">Selfie Example</label>
          <div className="flex h-56 items-center justify-center rounded-lg bg-lnd-surface-2 p-5 dark:bg-lnd-surface sm:p-8">
            <div className="text-center">
              <svg className="mx-auto mb-2 h-20 w-20 text-lnd-fg-muted dark:text-lnd-fg-muted" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <p className="text-lnd-fg-muted dark:text-lnd-fg-muted text-sm">Example of good selfie</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Examples */}
      <div>
        <p className="text-lnd-fg-muted dark:text-lnd-fg-muted font-medium mb-3">Reject Examples:</p>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {['Face Covered', 'Too Far From Camera', 'Wearing Glasses', 'Dark/Side'].map((reason) => (
            <div key={reason} className="rounded-lg bg-lnd-surface-2 p-3 text-center dark:bg-lnd-surface sm:p-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-500 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-lnd-fg-muted dark:text-lnd-fg-muted text-xs font-medium">{reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mt-6">
        <p className="text-amber-900 dark:text-amber-300 text-sm">
          <span className="font-medium">Support formats:</span> JPG, PNG under 5MB
        </p>
        <p className="text-amber-900 dark:text-amber-300 text-sm mt-1">
          <span className="font-medium">During face recognition:</span> Please make sure the face is centered, well lit and visible to avoid recognition errors
        </p>
      </div>
    </div>
  );
}