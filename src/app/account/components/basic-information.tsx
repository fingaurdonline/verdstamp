'use client';

import { UseFormReturn } from 'react-hook-form';
import { IDVerificationFormData } from '../../../lib/scheme';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { countries } from '@/lib/country';

const COUNTRIES = countries

const NATIONALITIES = countries

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface BasicInformationProps {
  form: UseFormReturn<IDVerificationFormData>;
}

export default function BasicInformation({ form }: BasicInformationProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const dateOfBirth = watch('dateOfBirth');

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-lnd-fg dark:text-lnd-fg">Nationality Information</h2>

      {/* Nationality */}
      <div>
        <Label htmlFor="nationality" className="text-lnd-fg-muted dark:text-lnd-fg-muted font-medium mb-2 block">
          Nationality
        </Label>
        <Select
          value={watch('nationality')}
          onValueChange={(val) => setValue('nationality', val, { shouldValidate: true })}
        >
          <SelectTrigger className="w-full px-4 py-2 border border-lnd-border dark:border-lnd-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lnd-accent/30 focus:border-transparent bg-lnd-surface dark:bg-lnd-surface text-lnd-fg dark:text-lnd-fg">
            <SelectValue placeholder="Please choose" />
          </SelectTrigger>
          <SelectContent>
            {NATIONALITIES.map((nat) => (
              <SelectItem key={nat.name} value={nat.name}>
                {nat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.nationality && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.nationality.message}</p>
        )}
      </div>

      {/* Country of Residence */}
      <div>
        <Label htmlFor="country" className="text-lnd-fg-muted dark:text-lnd-fg-muted font-medium mb-2 block">
          Country of Residence
        </Label>
        <Select
          value={watch('country')}
          onValueChange={(val) => setValue('country', val, { shouldValidate: true })}
        >
          <SelectTrigger className="w-full px-4 py-2 border border-lnd-border dark:border-lnd-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lnd-accent/30 focus:border-transparent bg-lnd-surface dark:bg-lnd-surface text-lnd-fg dark:text-lnd-fg">
            <SelectValue placeholder="Please choose" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((country) => (
              <SelectItem key={country.name} value={country.name}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.country && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.country.message}</p>
        )}
      </div>

      {/* Gender */}
      <div>
        <Label className="text-lnd-fg-muted dark:text-lnd-fg-muted font-medium mb-3 block">Gender</Label>
        <RadioGroup
          value={watch('gender')}
          onValueChange={(val: "male" | "female") => setValue('gender', val, { shouldValidate: true })}
          className="flex gap-6"
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem value="male" id="male" className="text-lnd-accent" />
            <Label htmlFor="male" className="text-lnd-fg-muted dark:text-lnd-fg-muted cursor-pointer">Male</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="female" id="female" className="text-lnd-accent" />
            <Label htmlFor="female" className="text-lnd-fg-muted dark:text-lnd-fg-muted cursor-pointer">Female</Label>
          </div>
        </RadioGroup>
        {errors.gender && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.gender.message}</p>
        )}
      </div>

      {/* Date of Birth */}
      <div>
        <Label className="text-lnd-fg-muted dark:text-lnd-fg-muted font-medium mb-3 block">Date of Birth</Label>
        <div className="grid grid-cols-3 gap-2 lg:gap-3">
          <Select
            value={watch('dateOfBirth.year')}
            onValueChange={(val) => setValue('dateOfBirth.year', val, { shouldValidate: true })}
          >
            <SelectTrigger className="px-2 lg:px-4 py-2 border border-lnd-border dark:border-lnd-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lnd-accent/30 focus:border-transparent bg-lnd-surface dark:bg-lnd-surface text-lnd-fg dark:text-lnd-fg">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={watch('dateOfBirth.month')}
            onValueChange={(val) => setValue('dateOfBirth.month', val, { shouldValidate: true })}
          >
            <SelectTrigger className="px-2 lg:px-4 py-2 border border-lnd-border dark:border-lnd-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lnd-accent/30 focus:border-transparent bg-lnd-surface dark:bg-lnd-surface text-lnd-fg dark:text-lnd-fg">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((month, index) => (
                <SelectItem key={month} value={String(index + 1).padStart(2, '0')}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={watch('dateOfBirth.day')}
            onValueChange={(val) => setValue('dateOfBirth.day', val, { shouldValidate: true })}
          >
            <SelectTrigger className="px-2 lg:px-4 py-2 border border-lnd-border dark:border-lnd-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lnd-accent/30 focus:border-transparent bg-lnd-surface dark:bg-lnd-surface text-lnd-fg dark:text-lnd-fg">
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <SelectItem key={day} value={String(day).padStart(2, '0')}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {errors.dateOfBirth && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.dateOfBirth.message}</p>
        )}
      </div>

      {/* ID Number */}
      <div>
        <Label htmlFor="idNumber" className="text-lnd-fg-muted dark:text-lnd-fg-muted font-medium mb-2 block">
          ID Number
        </Label>
        <Input
          id="idNumber"
          {...register('idNumber')}
          placeholder="277373737226626"
          className="border-lnd-border dark:border-lnd-border bg-lnd-surface dark:bg-lnd-surface text-lnd-fg dark:text-lnd-fg border focus:ring-lnd-accent/30 focus:border-transparent"
        />
        {errors.idNumber && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.idNumber.message}</p>
        )}
      </div>
    </div>
  );
}