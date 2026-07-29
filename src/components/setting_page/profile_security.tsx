"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  CircleCheckBig,
  Info,
  Mail,
  MessageSquare,
  Shield,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

const ProfileSecurity = () => {
  const router = useRouter();
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
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Admin User" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="admin@vovault.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tel">Phone Number</Label>
              <Input id="tel" type="tel" placeholder="+1 (555) 123-4567" />
            </div>

            <div className="flex items-center justify-between gap-2 border border-primary! rounded-lg p-4">
              <div className="flex  items-center gap-2 ">
                <Shield className="text-primary" />
                <div>
                  <p className="text-primary font-bold text-sm">Your Role</p>
                  <p className="text-xs text-primary">+971 50 482 9930</p>
                </div>
              </div>
              <CircleCheckBig className="text-primary" />
            </div>

            <div className="flex gap-3 pt-2">
              <Button className="flex-1">Save Changes</Button>
            </div>
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
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newpassword">New Password</Label>
              <Input
                id="newpassword"
                type="password"
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmNewpassword">Confirm Password</Label>
              <Input
                id="confirmNewpassword"
                type="password"
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex items-start  gap-2 border border-primary! rounded-lg p-4">
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
              <Button className="flex-1">Update Password</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between items-center gap-2 border border-border bg-card rounded-lg p-4 mt-5">
        <div className="flex  items-center gap-2 ">
          <div className="p-3 rounded-2xl bg-white w-fit">
            <Mail className="text-primary" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">
              Need to Reset Your Password?
            </p>
            <p className="text-xs">
              Forgot your password? We&apos;ll send a secure reset link to
              <span className="text-primary"> admin@rora.com</span>
            </p>
          </div>
        </div>
        <Button onClick={()=>router.push("/reset-password")} className="">Reset Your Password</Button>
      </div>
    </div>
  );
};

export default ProfileSecurity;
