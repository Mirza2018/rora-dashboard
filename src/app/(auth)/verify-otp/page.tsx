"use client"

import * as React from "react"
import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import Link from "next/link"


import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "@/components/layout/auth-layout"

const schema = z.object({
  otp: z.string().length(4, "Enter the full 4-digit code"),
})

type Values = z.infer<typeof schema>

function VerifyOtpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? "your email"

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { otp: "" },
  })

  async function onSubmit(values: Values) {
    try {
      // Replace with your real "verify OTP" API call.
      await new Promise((resolve) => setTimeout(resolve, 900))
      console.log("verify-otp values:", { email, ...values })
      toast.success("OTP verified successfully!")
      router.push(`/reset-password?email=${encodeURIComponent(email)}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid code. Please try again.")
    }
  }

  function onInvalid() {
    toast.error("Please enter the full 4-digit code.")
  }

  function handleResend() {
    toast.success(`A new code was sent to ${email}.`)
  }

  return (
    <AuthLayout subtitle="Reset your password">
      <h2 className="text-base font-semibold text-foreground">Enter OTP Code</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter the 4-digit code sent to your email
      </p>

      <p className="mt-4 text-center text-sm text-muted-foreground">We sent a 4-digit code to:</p>
      <p className="text-center text-sm font-semibold text-foreground">{email}</p>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="mt-5 space-y-4" noValidate>
        <FormField control={control} name="otp" type="otp" label="Enter OTP Code" otpLength={4} />

        <p className="text-center text-sm text-muted-foreground">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            className="font-semibold text-title hover:underline"
          >
            Resend OTP
          </button>
        </p>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Verifying..." : "Verify OTP"}
        </Button>

        <Link
          href="/forgot-password"
          className="block text-center text-sm text-muted-foreground hover:text-foreground"
        >
          Change Email
        </Link>
      </form>
    </AuthLayout>
  )
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  )
}
