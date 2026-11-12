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
      toast.custom(
        (id) => (
          <div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-red-900 bg-red-100">
            <span>Verification materials submitted successfully!</span>
          </div>
        ))
      // Support optionally redirecting out or closing modal based on system architecture later.
    } catch (e) {
      console.error(e);
      toast.custom(
        (id) => (
          <div className="w-80 lg:w-140 h-8 flex items-center justify-center space-x-2 text-red-900 bg-red-100">
            <span>Failed to submit verification materials. Check your connection.</span>
          </div>
        ))
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen lg:py-8 px-2  lg:px-8 bg-lnd-surface dark:bg-lnd-surface">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2">
            <BsPersonVcardFill className='w-7 h-7 text-lnd-accent dark:text-lnd-accent' />
            <h1 className="text-2xl font-bold text-lnd-fg dark:text-lnd-fg">ID Verification</h1>
          </div>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={STEPS} currentStep={currentStep} />

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="bg-lnd-surface dark:bg-lnd-surface rounded-xl shadow-lg p-4 lg:p-8 mt-8">
          {currentStep === 1 && <BasicInformation form={form} />}
          {currentStep === 2 && <UploadID form={form} />}
          {currentStep === 3 && <FaceRecognition form={form} />}

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-between mt-8 pt-8 border-t border-lnd-border dark:border-lnd-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              className="flex-1"
            >
              Previous
            </Button>
            {currentStep < STEPS.length ? (
              <Button
                type="button"
                onClick={() => validateAndAdvance()}
                className="flex-1 bg-lnd-accent hover:bg-lnd-accent/90 dark:bg-lnd-accent dark:hover:bg-lnd-accent/90 text-lnd-accent-fg"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-lnd-accent hover:bg-lnd-accent/90 dark:bg-lnd-accent dark:hover:bg-lnd-accent/90 text-lnd-accent-fg disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        </form>

        {/* Progress Text */}
        <p className="text-center text-lnd-fg-muted dark:text-lnd-fg-muted text-sm mt-6">
          Step {currentStep} of {STEPS.length}
        </p>
      </div>
    </div>
  );
}
