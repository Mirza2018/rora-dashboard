"use client";

import { CircleCheckBig, Info, Mail, Shield, User, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { toast } from "sonner";

import { RootState } from "@/redux/store";
// adjust to your actual path/action name
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import {
  useUserGetProfileQuery,
  useUserUpdateProfileMutation,
  useUserPasswordChangeMutation,
} from "@/redux/api/authApi"; // adjust to your actual path
import { setUserInfo } from "@/redux/slices/authSlice";

const ProfileSecurity = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  // ── Profile form state ───────────────────────────────────────
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // ── Password form state ──────────────────────────────────────
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const {
    data: response,
    isLoading,
    isFetching,
  } = useUserGetProfileQuery(undefined);
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUserUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useUserPasswordChangeMutation();

  const loading = isLoading || isFetching;
  const profile = response?.data;

  // Sync fetched profile into Redux + local form state.
  React.useEffect(() => {
    if (profile) {
      dispatch(setUserInfo(profile));
      setName(profile.name ?? "");
      setEmail(profile.email ?? "");
      setPhone(profile.phone ?? "");
      setImagePreview(profile.image ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    const toastId = toast.loading("Saving changes...");
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await updateProfile(formData).unwrap();
      dispatch(setUserInfo(res.data));
      setImageFile(null);
      toast.success("Profile updated successfully.", { id: toastId });
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to update profile.", {
        id: toastId,
      });
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    const toastId = toast.loading("Updating password...");
    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      }).unwrap();

      toast.success("Password changed successfully.", { id: toastId });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to change password.", {
        id: toastId,
      });
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="p-3 rounded-2xl bg-primary w-fit">
                <User />
              </div>
              <div>
                <h1 className="text-white">Profile Information</h1>
                <p className="text-muted-foreground text-xs">
                  Update your account details
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-20 rounded-full mx-auto" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <Avatar className="size-20">
                      <AvatarImage src={imagePreview} alt={name} />
                      <AvatarFallback>
                        {name?.slice(0, 2).toUpperCase() || "AD"}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5 text-white"
                      aria-label="Change profile photo"
                    >
                      <Camera size={14} />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Admin User"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@vovault.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tel">Phone Number</Label>
                  <Input
                    id="tel"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    disabled
                  />
                </div>

                <div className="flex items-center justify-between gap-2 border border-primary! rounded-lg p-4">
                  <div className="flex items-center gap-2 ">
                    <Shield className="text-primary" />
                    <div>
                      <p className="text-primary font-bold text-sm">
                        Your Role
                      </p>
                      <p className="text-xs text-primary">
                        {profile?.role ?? "—"}
                      </p>
                    </div>
                  </div>
                  <CircleCheckBig className="text-primary" />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1"
                    onClick={handleSaveProfile}
                    disabled={isUpdatingProfile}
                  >
                    {isUpdatingProfile ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="p-3 rounded-2xl bg-primary w-fit">
                <User />
              </div>
              <div>
                <h1 className="text-white">Security & Password</h1>
                <p className="text-muted-foreground text-xs">
                  Update your login credentials
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">Current Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newpassword">New Password</Label>
              <Input
                id="newpassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmNewpassword">Confirm Password</Label>
              <Input
                id="confirmNewpassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex items-start gap-2 border border-primary! rounded-lg p-4">
              <Info className="text-primary" />
              <div>
                <p className="text-primary font-bold text-sm">
                  Password Requirements:
                </p>
                <p className="text-xs text-primary">
                  • At least 8 characters long
                </p>
                <p className="text-xs text-primary">
                  • Include uppercase & lowercase letters
                </p>
                <p className="text-xs text-primary">
                  • Include numbers and special characters
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1"
                onClick={handleUpdatePassword}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center gap-2 border border-border bg-card rounded-lg p-4 mt-5">
        <div className="flex items-center gap-2 ">
          <div className="p-3 rounded-2xl bg-white w-fit">
            <Mail className="text-primary" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">
              Need to Reset Your Password?
            </p>
            <p className="text-xs">
              Forgot your password? We&apos;ll send a secure reset link to
              <span className="text-primary">
                {" "}
                {profile?.email ?? "your email"}
              </span>
            </p>
          </div>
        </div>
        <Button onClick={() => router.push("/reset-password")} className="">
          Reset Your Password
        </Button>
      </div>
    </div>
  );
};

export default ProfileSecurity;
