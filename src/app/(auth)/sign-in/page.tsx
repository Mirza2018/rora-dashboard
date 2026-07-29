"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Mail } from "lucide-react"
import Link from "next/link"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "@/components/layout/auth-layout"

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
})

type Values = z.infer<typeof schema>

export default function SignInPage() {
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: false },
  })

  async function onSubmit(values: Values) {
    try {
      // Replace with your real sign-in API call.
      await new Promise((resolve) => setTimeout(resolve, 900))
      console.log("sign-in values:", values)
      toast.success("Signed in successfully!")
      router.push("/dashboard/overview");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed. Please try again.")
    }
  }

  function onInvalid() {
    toast.error("Please fix the highlighted fields.")
  }

  return (
    <AuthLayout subtitle="Sign in to manage your platform">
      <h2 className="text-base font-semibold text-foreground">Welcome Back</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your credentials to access the admin dashboard
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
        <FormField
          control={control}
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
        />

        <div className="flex items-center justify-between">
          <FormField control={control} name="remember" type="checkbox" checkboxLabel="Remember me" />
          <Link href="/forgot-password" className="text-sm font-medium text-title hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </AuthLayout>
  )
}
