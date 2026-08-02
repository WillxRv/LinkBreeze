"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";

interface DuplicateThemeProps {
  activeName: string;
  onDuplicate: () => void;
  dupName: string;
  setDupName: (v: string) => void;
  dupPending: boolean;
}

export function DuplicateTheme({
  activeName,
  onDuplicate,
  dupName,
  setDupName,
  dupPending,
}: DuplicateThemeProps) {
  const { t } = useLanguage();

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-base">{t("Theme.duplicateTitle", "Duplicate theme")}</CardTitle>
        <CardDescription>
          {t("Theme.duplicateDesc", `Save a copy of "${activeName}" as a new custom theme you can edit freely.`).replace("{name}", activeName)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <Input
          value={dupName}
          onChange={(e) => setDupName(e.target.value)}
          placeholder={t("Theme.duplicatePlaceholder", `${activeName} (copy)`).replace("{name}", activeName)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onDuplicate();
            }
          }}
          maxLength={100}
        />
        <Button onClick={onDuplicate} disabled={dupPending || !dupName.trim()}>
          <Copy className="size-4" />
          {dupPending ? t("Theme.copying", "Copying…") : t("Theme.duplicate", "Duplicate")}
        </Button>
      </CardContent>
    </Card>
  );
}
