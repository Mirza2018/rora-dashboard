"use client";

import * as React from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, type SelectOption } from "@/components/ui/select";
import { RadioGroup, type RadioOption } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageField } from "@/components/ui/image-field";
import { PasswordInput } from "@/components/ui/password-input";
import { OtpInput } from "@/components/ui/otp-input";

export type FormFieldType =
  | "text"
  | "phone"
  | "email"
  | "number"
  | "password"
  | "select"
  | "radio"
  | "checkbox"
  | "textarea"
  | "image"
  | "otp";

export type FormFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  type: FormFieldType;
  label?: string;
  placeholder?: string;
  description?: string;
  /** Options for "select" and "radio" types. */
  options?: (SelectOption | RadioOption)[];
  /** Label shown next to a "checkbox" field (falls back to `label`). */
  checkboxLabel?: string;
  /** Rows for "textarea". Defaults to 4. */
  rows?: number;
  /** Number of boxes for "otp". Defaults to 4. */
  otpLength?: number;
  searchable?: boolean; // passed through to "select"
  /** Leading icon for text/email/phone/password fields. */
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  className?: string;
};

export function FormField<TFieldValues extends FieldValues>({
  control,
  name,
  type,
  label,
  placeholder,
  description,
  options = [],
  checkboxLabel,
  rows = 4,
  otpLength = 4,
  searchable,
  icon: Icon,
  disabled,
  className,
}: FormFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const error = fieldState.error?.message;
        const fieldId = name;

        return (
          <div className={cn("space-y-1.5", className)}>
            {label && type !== "checkbox" && (
              <Label htmlFor={fieldId}>{label}</Label>
            )}

            {(type === "text" ||
              type === "email" ||
              type === "phone" ||
              type === "number") && (
              <div className="relative">
                {Icon && (
                  <Icon className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                )}
                <Input
                  id={fieldId}
                  type={
                    type === "text" ? "text" : type === "phone" ? "tel" : type
                  }
                  placeholder={placeholder}
                  disabled={disabled}
                  aria-invalid={!!error}
                  name={field.name}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  className={cn(
                    Icon && "pl-9",
                    error &&
                      "border-status-failed focus-visible:ring-status-failed/40",
                  )}
                />
              </div>
            )}

            {type === "password" && (
              <PasswordInput
                id={fieldId}
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={!!error}
                name={field.name}
                onBlur={field.onBlur}
                ref={field.ref}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                className={cn(
                  error &&
                    "border-status-failed focus-visible:ring-status-failed/40",
                )}
              />
            )}

            {type === "textarea" && (
              <Textarea
                id={fieldId}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                aria-invalid={!!error}
                name={field.name}
                onBlur={field.onBlur}
                ref={field.ref}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                className={cn(
                  error &&
                    "border-status-failed focus-visible:ring-status-failed/40",
                )}
              />
            )}

            {type === "select" && (
              <Select
                placeholder={placeholder}
                disabled={disabled}
                searchable={searchable}
                options={options as SelectOption[]}
                value={field.value ?? null}
                onValueChange={field.onChange}
                triggerClassName={cn(error && "border-status-failed")}
              />
            )}

            {type === "radio" && (
              <RadioGroup
                options={options as RadioOption[]}
                value={field.value ?? null}
                onValueChange={field.onChange}
                disabled={disabled}
              />
            )}

            {type === "checkbox" && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id={fieldId}
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                />
                {(checkboxLabel || label) && (
                  <Label
                    htmlFor={fieldId}
                    className="cursor-pointer font-normal"
                  >
                    {checkboxLabel || label}
                  </Label>
                )}
              </div>
            )}

            {type === "image" && (
              <ImageField
                value={field.value}
                onChange={field.onChange}
                disabled={disabled}
              />
            )}

            {type === "otp" && (
              <OtpInput
                length={otpLength}
                value={field.value ?? ""}
                onChange={field.onChange}
                disabled={disabled}
                hasError={!!error}
              />
            )}

            {description && !error && (
              <p className="text-muted-foreground text-xs">{description}</p>
            )}
            {error && (
              <p
                className={cn(
                  "text-status-failed text-xs",
                  type === "otp" && "text-center",
                )}
              >
                {error}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
