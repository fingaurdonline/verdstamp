'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { idVerificationSchema, type IDVerificationFormData } from '../../../lib/scheme';
import StepIndicator from '../components/step-indicator';
import BasicInformation from '../components/basic-information';
import UploadID from '../components/upload-id';
import FaceRecognition from '../components/face-recognition';
import { Button } from '@/components/ui/button';
import { BsPersonVcardFill } from 'react-icons/bs';
import { api } from '@convex/_generated/api';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';

const STEPS = [
  { id: 1, title: 'Basic Info' },
  { id: 2, title: 'Upload ID' },
  { id: 3, title: 'Face Selfie' },
];

export default function IDVerificationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createIdVerification = useMutation(api.verification.create_id_verification);
  const generateUploadUrl = useMutation(api.verification.generateUploadUrl);

  const form = useForm<IDVerificationFormData>({
    resolver: zodResolver(idVerificationSchema),
    mode: 'onBlur',
    defaultValues: {
      nationality: '',
      country: '',
      gender: 'male',
      dateOfBirth: { year: '1990', month: '', day: '' },
      idNumber: '',
      idFront: undefined,
      idBack: undefined,
      selfie: undefined,
    },
  });

  const getCurrentStepFields = (): string[] => {
    const stepFields: Record<number, string[]> = {
      1: ['nationality', 'country', 'gender', 'dateOfBirth', 'idNumber'],
      2: ['idFront', 'idBack'],
      3: ['selfie'],
    };
    return stepFields[currentStep] ?? [];
  };

  const validateAndAdvance = async () => {
    const fieldsToValidate = getCurrentStepFields();
    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const buildDate = (dob: { year: string; month: string; day: string }): Date | undefined => {
    if (!dob.year || !dob.month || !dob.day) return undefined;
    const date = new Date(`${dob.year}-${dob.month.padStart(2, '0')}-${dob.day.padStart(2, '0')}`);
    return isNaN(date.getTime()) ? undefined : date;
  };

  const onSubmit = async (data: IDVerificationFormData) => {
    try {
      setIsSubmitting(true);

      const uploadFile = async (files: any) => {
        const file = Array.isArray(files) ? files[0] : (files instanceof FileList ? files[0] : files);
        if (!file) return undefined;

        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) throw new Error("File upload failed");
        const json = await result.json();
        return json.storageId as string;
      };

      const idFrontId = await uploadFile(data.idFront);
      const idBackId = await uploadFile(data.idBack);
      const selfieId = await uploadFile(data.selfie);

      await createIdVerification({
        nationality: data.nationality,
        country_residence: data.country,
        gender: data.gender,
        date_of_birth: buildDate(data.dateOfBirth)?.toISOString() ?? new Date().toISOString(),
        id_number: data.idNumber,
        id_front: idFrontId as any,
        id_back: idBackId as any,
        selfie: selfieId as any,
      });
      toast.success("Verification materials submitted successfully!");
      // Support optionally redirecting out or closing modal based on system architecture later.
    } catch (e) {
      console.error(e);
      toast.error("Failed to submit verification materials. Check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-lnd-surface px-1 py-4 dark:bg-lnd-surface sm:px-2 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <div className="mb-6 text-center sm:mb-8">
          <div className="flex items-center justify-center gap-2">
            <BsPersonVcardFill className='h-6 w-6 shrink-0 text-lnd-accent dark:text-lnd-accent sm:h-7 sm:w-7' />
            <h1 className="text-xl font-bold text-lnd-fg dark:text-lnd-fg sm:text-2xl">ID Verification</h1>
          </div>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={STEPS} currentStep={currentStep} />

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 rounded-xl bg-lnd-surface p-3 shadow-lg dark:bg-lnd-surface sm:p-4 lg:mt-8 lg:p-8">
          {currentStep === 1 && <BasicInformation form={form} />}
          {currentStep === 2 && <UploadID form={form} />}
          {currentStep === 3 && <FaceRecognition form={form} />}

          {/* Navigation Buttons */}
          <div className="mt-6 flex gap-3 border-t border-lnd-border pt-6 dark:border-lnd-border sm:mt-8 sm:gap-4 sm:pt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              className="h-11 min-w-0 flex-1 border-lnd-border text-sm dark:border-lnd-border dark:bg-transparent dark:text-lnd-fg"
            >
              Previous
            </Button>
            {currentStep < STEPS.length ? (
              <Button
                type="button"
                onClick={() => validateAndAdvance()}
                className="h-11 min-w-0 flex-1 bg-lnd-accent text-sm text-lnd-accent-fg hover:bg-lnd-accent/90 dark:bg-lnd-accent dark:text-lnd-accent-fg dark:hover:bg-lnd-accent/90"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 min-w-0 flex-1 bg-lnd-accent text-sm text-lnd-accent-fg hover:bg-lnd-accent/90 disabled:opacity-50 dark:bg-lnd-accent dark:text-lnd-accent-fg dark:hover:bg-lnd-accent/90"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        </form>

        {/* Progress Text */}
        <p className="mt-4 text-center text-sm text-lnd-fg-muted dark:text-lnd-fg-muted sm:mt-6">
          Step {currentStep} of {STEPS.length}
        </p>
      </div>
    </div>
  );
}
