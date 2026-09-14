"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { useDispatch } from "react-redux";

import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/layout/auth-layout";
import {
  clearAuth,
  setAccessToken,
  setResetPasswordToken,
} from "@/redux/slices/authSlice";
import {
  useUserVerifyOTPMutation,
  useUserResendVerifyOTPMutation,
} from "@/redux/api/authApi";

const schema = z.object({
  otp: z.string().length(4, "Enter the full 4-digit code"),
});

type Values = z.infer<typeof schema>;

function VerifyOtpForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") ?? "your phone";

  const [verifyOtp, { isLoading: isSubmitting }] = useUserVerifyOTPMutation();
  const [resendOtp, { isLoading: isResending }] =
    useUserResendVerifyOTPMutation();

  const { control, handleSubmit } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { otp: "" },
  });

  async function onSubmit(values: Values) {
    try {
      // Uses the otpToken currently in state.auth.accessToken as the auth header.
      const res = await verifyOtp({ otp: values.otp }).unwrap();

      dispatch(clearAuth());
      // Swap it for the resetToken — this becomes the new access token
      // used to authorize the final reset-password call.
      dispatch(setResetPasswordToken(res?.data?.resetToken));

      toast.success("OTP verified successfully!");
      router.push(`/new-password?phone=${encodeURIComponent(phone)}`);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Invalid code. Please try again.");
    }
  }

  function onInvalid() {
    toast.error("Please enter the full 4-digit code.");
  }

  async function handleResend() {
    const toastId = toast.loading("Resending code...");
    // dispatch(clearAuth())
    try {
      const res = await resendOtp({ phone }).unwrap();
      dispatch(setAccessToken(res?.data?.otpToken));
      toast.success(`A new code was sent to ${phone}.`, { id: toastId });
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to resend code.", {
        id: toastId,
      });
    }
  }

  return (
    <AuthLayout subtitle="Reset your password">
      <h2 className="text-base font-semibold text-foreground">
        Enter OTP Code
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter the 4-digit code sent to your phone
      </p>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        We sent a 4-digit code to:
      </p>
      <p className="text-center text-sm font-semibold text-foreground">
        {phone}
      </p>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="mt-5 space-y-4"
        noValidate
      >
        <FormField
          control={control}
          name="otp"
          type="otp"
          label="Enter OTP Code"
          otpLength={4}
        />

        <p className="text-center text-sm text-muted-foreground">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="font-semibold text-title hover:underline disabled:opacity-50"
          >
            {isResending ? "Resending..." : "Resend OTP"}
          </button>
        </p>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Verifying..." : "Verify OTP"}
        </Button>

        <Link
          href="/forgot-password"
          className="block text-center text-sm text-muted-foreground hover:text-foreground"
        >
          Change Phone Number
        </Link>
      </form>
    </AuthLayout>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}
