"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Phone } from "lucide-react";
import Link from "next/link";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/layout/auth-layout";
import { useUserLoginMutation } from "@/redux/api/authApi";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import {
  clearAuth,
  setAccessToken,
  setUserInfo,
} from "@/redux/slices/authSlice";

const schema = z.object({
  phone: z.string().min(5, "Phone number is required"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type Values = z.infer<typeof schema>;

export default function SignInPage() {
  const [userLogin] = useUserLoginMutation();
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { phone: "", password: "", remember: false },
  });

  async function onSubmit(values: Values) {
    console.log(values);
    const toastId = toast.loading("Logging in...");
    const loginData = {
      phone: values.phone,
      password: values.password,
    };

    // return;
    try {
      const res = await userLogin(loginData).unwrap();

      dispatch(clearAuth());
      dispatch(setAccessToken(res?.data?.accessToken));
      dispatch(setUserInfo(res?.data?.admin));
      cookies.set("rora_dashboard_accessToken", res?.data?.accessToken, {
        path: "/",
        sameSite: "lax",
      });
      toast.success(res.message || "Login successful", {
        id: toastId,
        duration: 2000,
      });

      if (res?.data?.role !== "SUPER_ADMIN") {
        return toast.warning("Please use admin Email to login Dashboard", {
          id: toastId,
          duration: 2000,
        });
      }

      // router.push("/dashboard/overview");
      // router.refresh();
      window.location.assign("/dashboard/overview");
      //  setIsLoading(false);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.error ||
          "An error occurred during Login",
        {
          id: toastId,
          duration: 2000,
        },
      );
    }
  }

  function onInvalid() {
    toast.error("Please fix the highlighted fields.");
  }

  return (
    <AuthLayout subtitle="Sign in to manage your platform">
      <h2 className="text-base font-semibold text-foreground">Welcome Back</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your credentials to access the admin dashboard
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
          label="Phone"
          placeholder="+123 456 789"
          icon={Phone}
        />
        <FormField
          control={control}
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
        />

        <div className="flex items-center justify-between">
          <FormField
            control={control}
            name="remember"
            type="checkbox"
            checkboxLabel="Remember me"
          />
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-title hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </AuthLayout>
  );
}
