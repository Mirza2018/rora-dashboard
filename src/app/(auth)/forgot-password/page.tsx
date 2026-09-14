"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Phone, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useDispatch } from "react-redux";

import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/layout/auth-layout";

import { setAccessToken } from "@/redux/slices/authSlice";
import { useUserForgotPasswordMutation } from "@/redux/api/authApi";
import { normalizePhone } from "@/lib/phone";

const schema = z.object({
  phone: z.string().min(6, "Enter a valid phone number"),
});

type Values = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [forgotPassword, { isLoading: isSubmitting }] =
    useUserForgotPasswordMutation();

  const { control, handleSubmit } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { phone: "" },
  });

  async function onSubmit(values: Values) {
    const phone = normalizePhone(values.phone);

    try {
      const res = await forgotPassword({ phone }).unwrap();

      // Store the otpToken as the access token so subsequent
      // authenticated calls (verify-otp, resend-otp) pick it up.
      dispatch(setAccessToken(res?.data?.otpToken));

      toast.success("OTP code sent to your phone!");
      router.push(`/otp?phone=${encodeURIComponent(phone)}`);
    } catch (err: any) {
      toast.error(
        err?.data?.message ?? "Could not send code. Please try again.",
      );
    }
  }

  function onInvalid() {
    toast.error("Please fix the highlighted fields.");
  }

  return (
    <AuthLayout subtitle="Reset your password">
      <h2 className="text-base font-semibold text-foreground">
        Forgot Password?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your phone number and we will send you a verification code
      </p>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="mt-5 space-y-4"
        noValidate
      >
        <FormField
          control={control}
          name="phone"
          type="phone"
          label="Phone Number"
          placeholder="+971500000001"
          icon={Phone}
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
  );
}
