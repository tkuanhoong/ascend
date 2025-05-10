"use client";
import CardWrapper from "@/components/form/card-wrapper";
import { FormErrorMessage } from "@/components/form/form-error-message";
import { FormSuccessMessage } from "@/components/form/form-success-message";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/axios";
import { GalleryVerticalEnd, Home, LogIn } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

const NewVerificationPage = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const token = searchParams.get("token");

  const verifyToken = useCallback(async () => {
    if (!token) {
      setError("Missing token!");
      return;
    }

    await apiClient
      .post("/api/auth/new-verification", { token })
      .then((res) => {
        setSuccess(res.data.success);
      })
      .catch((error) => {
        setError(error.response.data.error);
      });
  }, [token]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Ascend
        </Link>
        <CardWrapper
          headerDescription={
            error
              ? "Oops! Something went wrong!"
              : success
              ? "Email verified! You can now login."
              : "Confirming your verification..."
          }
        >
          <div className="grid gap-6">
            <div className="flex items-center w-full justify-center">
              {!success && !error && <BeatLoader />}
              {success && <FormSuccessMessage message={success} />}
              {error && <FormErrorMessage message={error} />}
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">
                <Home />
                Back to Home
              </Link>
            </Button>
            <Button className="w-full md:max-w-sm" asChild>
              <Link href="/auth/login">
                <LogIn />
                Back to Login
              </Link>
            </Button>
          </div>
        </CardWrapper>
      </div>
    </div>
  );
};

export default NewVerificationPage;
