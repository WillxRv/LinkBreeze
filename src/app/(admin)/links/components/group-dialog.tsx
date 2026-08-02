"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createLinkGroupAction, updateLinkGroupAction } from "@/server/actions/groups";
import type { LinkGroupRow } from "@/server/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/components/providers/language-provider";

interface GroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: LinkGroupRow | null;
  pageId?: number;
}

export function GroupDialog({ open, onOpenChange, editing, pageId }: GroupDialogProps) {
  const { t } = useLanguage();
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const isEdit = !!editing;

  React.useEffect(() => {
    if (open) setError(null);
  }, [open]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (pageId) formData.append("pageId", String(pageId));

    startTransition(async () => {
      try {
        if (isEdit) {
          await updateLinkGroupAction(editing.id, formData);
        } else {
          await createLinkGroupAction(formData);
        }
        router.refresh();
        onOpenChange(false);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? t("Links.editGroup", "Edit group") : t("Links.addGroup", "Add group")}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? t("Links.groupEditSubtitle", "Update your group settings.")
                : t("Links.groupAddSubtitle", "Groups help you organize links under a common title.")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">{t("Links.groupTitle", "Title")}</Label>
              <Input
                id="title"
                name="title"
                defaultValue={editing?.title ?? ""}
                placeholder={t("Placeholders.titleInput")}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="linkSearch"
                name="linkSearch"
                value="true"
                defaultChecked={editing?.linkSearch ?? false}
                className="size-4 rounded border-input"
              />
              <Label htmlFor="linkSearch" className="font-normal cursor-pointer">
                {t("Links.groupSearchLabel", "Enable search box for links in this group")}
              </Label>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="columns">{t("Links.groupColumns", "Layout Columns")}</Label>
              <Select name="columns" defaultValue={editing?.columns ? String(editing.columns) : "1"}>
                <SelectTrigger>
                  <SelectValue placeholder={t("Links.groupColumns", "Select columns")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{t("Links.col1", "1 Column")}</SelectItem>
                  <SelectItem value="2">{t("Links.col2", "2 Columns")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <div className="text-sm text-destructive">{error}</div>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              {t("Common.cancel", "Cancel")}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending
                ? t("Common.saving", "Saving...")
                : isEdit
                ? t("Common.saveChanges", "Save changes")
                : t("Links.addGroup", "Add group")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
