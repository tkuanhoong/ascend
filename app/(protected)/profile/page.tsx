"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTabContent } from "./_components/profile-tab-content";
import { ProfileAccountForm } from "./_components/profile-account-form";
import { useEffect, useState } from "react";
import { ChangePasswordForm } from "./_components/change-password-form";
import { User } from ".prisma/client";
import { ProfileAccountFormSkeleton } from "./_components/profile-form-skeleton";
import apiClient from "@/lib/axios";
import { unexpectedErrorToast } from "@/lib/toast";

export default function ProfilePage() {
  const [user, setUser] = useState<User>();

  const fetchUserData = async () => {
    await apiClient
      .get("/api/profile")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((error) => {
        console.error(error);
        unexpectedErrorToast();
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <div className="flex flex-col bg-muted p-6 min-h-svh gap-6 md:p-10">
        <h1 className="text-2xl font-semibold">User Profile</h1>
        <Tabs defaultValue="account" className="md:flex md:gap-2">
          <TabsList className="grid grid-cols-2 w-full md:max-w-xs md:h-full md:grid-cols-1">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <ProfileTabContent
            value="account"
            title="Account"
            description="Make changes to your account here. Click save when you're
                  done."
          >
            {user ? (
              <ProfileAccountForm user={user} />
            ) : (
              <ProfileAccountFormSkeleton />
            )}
          </ProfileTabContent>
          <ProfileTabContent
            value="password"
            title="Password"
            description="Change your password here."
          >
            <ChangePasswordForm />
          </ProfileTabContent>
        </Tabs>
      </div>
    </>
  );
}
