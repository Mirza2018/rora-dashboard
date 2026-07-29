"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "@/components/layout/auth-layout"

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
})

type Values = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: Values) {
    try {
      // Replace with your real "send OTP" API call.
      await new Promise((resolve) => setTimeout(resolve, 900))
      console.log("forgot-password values:", values)
      toast.success("OTP code sent to your email!")
      router.push(`/verify-otp?email=${encodeURIComponent(values.email)}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send code. Please try again.")
    }
  }

  function onInvalid() {
    toast.error("Please fix the highlighted fields.")
  }

  return (
    <AuthLayout subtitle="Reset your password">
      <h2 className="text-base font-semibold text-foreground">Forgot Password?</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your email address and we will send you a verification code
      </p>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="mt-5 space-y-4" noValidate>
        <FormField
          control={control}
          name="email"
          type="email"
          label="Email Address"
          placeholder="admin@yatos.com"
          icon={Mail}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send OTP Code"}
        </Button>

        <Link
          href="/sign-in"
          className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to Login
        </Link>
      </form>
    </AuthLayout>
  )
}
