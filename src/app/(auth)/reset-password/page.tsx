"use client"

import * as React from "react"
import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"


import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "@/components/layout/auth-layout"

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type Values = z.infer<typeof schema>

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  async function onSubmit(values: Values) {
    try {
      // Replace with your real "reset password" API call.
      await new Promise((resolve) => setTimeout(resolve, 900))
      console.log("reset-password values:", { email, password: values.password })
      toast.success("Password reset successfully!")
      router.push("/sign-in")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not reset password. Please try again.")
    }
  }

  function onInvalid() {
    toast.error("Please fix the highlighted fields.")
  }

  return (
    <AuthLayout subtitle="Reset your password">
      <h2 className="text-base font-semibold text-foreground">Welcome Back</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your credentials to access the admin dashboard
      </p>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="mt-5 space-y-4" noValidate>
        <FormField
          control={control}
          name="password"
          type="password"
          label="New Password"
          placeholder="Enter your password"
        />
        <FormField
          control={control}
          name="confirmPassword"
          type="password"
          label="Confirm New Password"
          placeholder="Enter your password"
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  )
}
