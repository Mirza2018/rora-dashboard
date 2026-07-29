"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";

// ── Zod schema: single source of truth for validation ──────────
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .min(7, "Enter a valid phone number")
    .regex(/^[0-9+\-\s()]+$/, "Only digits, spaces, +, -, ( ) are allowed"),
  age: z
    .string()
    .min(1, "Age is required")
    .refine((v) => !Number.isNaN(Number(v)), "Age must be a number")
    .refine((v) => Number(v) >= 18, "You must be at least 18")
    .refine((v) => Number(v) <= 120, "Enter a valid age"),
  plan: z.string().min(1, "Please select a plan"),
  gender: z.string().min(1, "Please select an option"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be under 500 characters"),
  agree: z.boolean().refine((v) => v === true, "You must accept the terms"),
  avatar: z.instanceof(File).nullable().optional(),
});

type SignupValues = z.infer<typeof signupSchema>;

export default function FormDemoPage() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      age: "",
      plan: "",
      gender: "",
      message: "",
      agree: false,
      avatar: null,
    },
  });

  async function onSubmit(values: SignupValues) {
    try {
      // Replace with your real API call.
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.15
            ? resolve()
            : reject(new Error("Server error — please try again."));
        }, 1200);
      });

      toast.success("Form submitted successfully!", {
        description: `Welcome aboard, ${values.name}.`,
      });
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  function onInvalid() {
    toast.error("Please fix the highlighted fields.");
  }

  return (
    <main className="flex-1 p-6">
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>
            All field types in one reusable form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className="space-y-4"
            noValidate
          >
            <FormField
              control={control}
              name="name"
              type="text"
              label="Full name"
              placeholder="Jane Cooper"
            />

            <FormField
              control={control}
              name="email"
              type="email"
              label="Email"
              placeholder="jane@company.com"
            />

            <FormField
              control={control}
              name="phone"
              type="phone"
              label="Phone"
              placeholder="+1 555 123 4567"
            />

            <FormField
              control={control}
              name="age"
              type="number"
              label="Age"
              placeholder="25"
            />

            <FormField
              control={control}
              name="plan"
              type="select"
              label="Plan"
              placeholder="Select a plan"
              options={[
                { label: "Starter", value: "starter" },
                { label: "Pro", value: "pro" },
                { label: "Enterprise", value: "enterprise" },
              ]}
            />

            <FormField
              control={control}
              name="gender"
              type="radio"
              label="Gender"
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Other", value: "other" },
              ]}
            />

            <FormField
              control={control}
              name="message"
              type="textarea"
              label="Message"
              placeholder="Tell us a bit about yourself..."
              rows={4}
            />

            <FormField
              control={control}
              name="avatar"
              type="image"
              label="Avatar"
            />

            <FormField
              control={control}
              name="agree"
              type="checkbox"
              checkboxLabel="I agree to the Terms and Privacy Policy"
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="cancel"
                className="flex-1"
                onClick={() => reset()}
              >
                Reset
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
