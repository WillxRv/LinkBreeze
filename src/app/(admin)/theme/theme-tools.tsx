"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Download, Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ThemeRow } from "@/server/queries";
import { useLanguage } from "@/components/providers/language-provider";

interface ThemeToolsProps {
  themes: ThemeRow[];
}

export function ThemeTools({ themes }: ThemeToolsProps) {
  const { t } = useLanguage();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const router = useRouter();

  const handleExport = (id: number) => {
    setError(null);
    const a = document.createElement("a");
    a.href = `/api/themes/export?id=${id}`;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportClick = () => {
    setError(null);
    inputRef.current?.click();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setBusy(true);
    setError(null);
    try {
      const text = await file.text();
      const res = await fetch("/api/themes/import", {
        method: "POST",
        body: text,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `Import failed (HTTP ${res.status})`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <CardTitle>{t("Theme.importExportTitle", "Import & export")}</CardTitle>
        <CardDescription>
          {t("Theme.importExportDesc", "Download a theme as a .json file to back it up or share it, then re-import on any LinkBreeze instance. Imported themes are added as inactive copies.")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">{t("Theme.exportTheme", "Export a theme")}</span>
          <div className="flex flex-wrap gap-2">
            {themes.map((tItem) => (
              <Button
                key={tItem.id}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleExport(tItem.id)}
              >
                <Download className="size-4" />
                {tItem.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">{t("Theme.importTheme", "Import a theme")}</span>
          <input
            ref={inputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleFile}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleImportClick}
            disabled={busy}
          >
            <Upload className="size-4" />
            {busy ? t("Theme.importing", "Importing…") : t("Theme.chooseJson", "Choose JSON file…")}
          </Button>
          <p className="text-xs text-muted-foreground">
            {t("Theme.importHint", "Select a theme .json file you previously exported from LinkBreeze.")}
          </p>
        </div>

        {error ? (
          <p className="flex items-center gap-1.5 text-sm text-destructive">
            <AlertCircle className="size-4" />
            {error}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
