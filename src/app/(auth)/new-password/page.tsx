"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/layout/auth-layout";
import { setAccessToken } from "@/redux/slices/authSlice";
import { useUserResetPasswordMutation } from "@/redux/api/authApi";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Values = z.infer<typeof schema>;

function ResetPasswordForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [resetPassword, { isLoading: isSubmitting }] =
    useUserResetPasswordMutation();

  const { control, handleSubmit } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: Values) {
    try {
      // Sent with resetToken (currently in state.auth.accessToken) as
      // the auth header, same as every other call in this flow.
      await resetPassword({
        newPassword: values.password,
        confirmPassword: values.confirmPassword,
      }).unwrap();

      // Flow's done — clear the token so the user has to sign in fresh.
      dispatch(setAccessToken(null));

      toast.success("Password reset successfully!");
      router.push("/sign-in");
    } catch (err: any) {
      toast.error(
        err?.data?.message ?? "Could not reset password. Please try again.",
      );
    }
  }

  function onInvalid() {
    toast.error("Please fix the highlighted fields.");
  }

  return (
    <AuthLayout subtitle="Reset your password">
      <h2 className="text-base font-semibold text-foreground">
        Set New Password
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose a new password for your account
      </p>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="mt-5 space-y-4"
        noValidate
      >
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
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
