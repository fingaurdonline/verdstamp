import { z } from 'zod';

export const idVerificationSchema = z.object({
  nationality: z.string().min(1, 'Nationality is required'),
  country: z.string().min(1, 'Country of residence is required'),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: 'Gender is required' }),
  }),
  dateOfBirth: z.object({
    year: z.string().min(1, 'Year is required'),
    month: z.string().min(1, 'Month is required'),
    day: z.string().min(1, 'Day is required'),
  }).refine(
    (data) => {
      if (!data.year || !data.month || !data.day) return false;
      const date = new Date(
        parseInt(data.year),
        parseInt(data.month) - 1,
        parseInt(data.day)
      );
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= 18 && age <= 120;
    },
    { message: 'You must be at least 18 years old' }
  ),
  idNumber: z.string()
    .min(1, 'ID number is required')
    .regex(/^[0-9]{15,}$/, 'ID number must contain only digits'),
  idFront: z.union([
    typeof window !== 'undefined' ? z.instanceof(FileList) : z.any(),
    z.instanceof(File)
  ])
    .refine((files) => {
      const file = Array.isArray(files) ? files[0] : files;
      return file && file.size <= 5 * 1024 * 1024;
    }, 'File size must be less than 5MB')
    .refine(
      (files) => {
        const file = Array.isArray(files) ? files[0] : files;
        return file && ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
      },
      'File must be JPG, PNG or PDF'
    ),
  idBack: z.union([
    typeof window !== 'undefined' ? z.instanceof(FileList) : z.any(),
    z.instanceof(File)
  ])
    .refine((files) => {
      const file = Array.isArray(files) ? files[0] : files;
      return file && file.size <= 5 * 1024 * 1024;
    }, 'File size must be less than 5MB')
    .refine(
      (files) => {
        const file = Array.isArray(files) ? files[0] : files;
        return file && ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
      },
      'File must be JPG, PNG or PDF'
    ),
  selfie: z.union([
    z.instanceof(File),
    typeof window !== 'undefined' ? z.instanceof(FileList) : z.any()
  ])
    .refine((files) => {
      const file = Array.isArray(files) ? files[0] : files;
      return file && file.size <= 5 * 1024 * 1024;
    }, 'File size must be less than 5MB')
    .refine(
      (files) => {
        const file = Array.isArray(files) ? files[0] : files;
        return file && ['image/jpeg', 'image/png'].includes(file.type);
      },
      'File must be JPG or PNG'
    ),
});

export type IDVerificationFormData = z.infer<typeof idVerificationSchema>;