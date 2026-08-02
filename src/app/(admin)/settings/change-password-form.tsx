"use client";

import * as React from "react";
import { Lock } from "lucide-react";
import { changePassword } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";

export function ChangePasswordForm() {
  const { t } = useLanguage();
  const [pending, startTransition] = React.useTransition();
  const [result, setResult] = React.useState<
    { ok: true } | { ok: false; error: string } | null
  >(null);

  const handleSubmit = (formData: FormData) => {
    setResult(null);
    startTransition(async () => {
      const res = await changePassword(formData);
      setResult(res.success ? { ok: true } : { ok: false, error: res.error });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="size-4" />
          {t("Settings.changePassword", "Change password")}
        </CardTitle>
        <CardDescription>{t("Settings.changePasswordDesc", "Update your admin password.")}</CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="flex flex-col gap-4">
          <FormField label={t("Settings.currentPassword", "Current password")} htmlFor="currentPassword" required>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
            />
          </FormField>
          <FormField
            label={t("Settings.newPassword", "New password")}
            htmlFor="newPassword"
            required
            hint={t("Settings.newPasswordHint", "At least 8 characters with one uppercase letter and one number.")}
          >
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </FormField>
          {result ? (
            result.ok ? (
              <p className="text-sm text-success">{t("Settings.passwordUpdated", "Password updated.")}</p>
            ) : (
              <p className="text-sm text-destructive">{result.error}</p>
            )
          ) : null}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={pending}>
            {pending ? t("Settings.updating", "Updating…") : t("Settings.updatePassword", "Update password")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
