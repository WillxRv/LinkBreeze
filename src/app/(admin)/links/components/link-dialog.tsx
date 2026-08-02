"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  createLink,
  updateLink,
} from "@/server/actions/links";
import type { LinkRow, LinkGroupRow } from "@/server/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Switch } from "@/components/ui/switch";
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
import {
  LINK_TYPES,
  getUrlLabel,
  getUrlPlaceholder,
  prefixLinkUrl,
} from "../link-helpers";
import { useLanguage } from "@/components/providers/language-provider";

export interface LinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: LinkRow | null;
  pageId?: number;
  groups?: LinkGroupRow[];
}

export function LinkDialog({ open, onOpenChange, editing, pageId, groups = [] }: LinkDialogProps) {
  const { t } = useLanguage();
  const [pending, startTransition] = React.useTransition();
  const [type, setType] = React.useState(editing?.type ?? "url");
  const [groupId, setGroupId] = React.useState(editing?.groupId ? String(editing.groupId) : "none");
  const [highlighted, setHighlighted] = React.useState(editing?.isHighlighted ?? false);
  const [active, setActive] = React.useState(editing?.isActive ?? true);
  const [scheduled, setScheduled] = React.useState(!!editing?.scheduleStart || !!editing?.scheduleEnd);
  const [autoIcon, setAutoIcon] = React.useState(editing?.autoIcon ?? true);
  const router = useRouter();

  // Reset local form state whenever the dialog opens (or switches target).
  const sessionKey = open ? `open:${editing?.id ?? "new"}` : "closed";
  const [lastSession, setLastSession] = React.useState(sessionKey);
  if (sessionKey !== lastSession) {
    setLastSession(sessionKey);
    if (open) {
      setType(editing?.type ?? "url");
      setGroupId(editing?.groupId ? String(editing.groupId) : "none");
      setHighlighted(editing?.isHighlighted ?? false);
      setActive(editing?.isActive ?? true);
      setScheduled(!!editing?.scheduleStart || !!editing?.scheduleEnd);
      setAutoIcon(editing?.autoIcon ?? true);
    }
  }

  const urlLabel = getUrlLabel(type);
  const urlPlaceholder = getUrlPlaceholder(type);

  const handleSubmit = (formData: FormData) => {
    const rawUrl = (formData.get("url") as string) || "";
    formData.set("url", prefixLinkUrl(type, rawUrl));
    formData.set("type", type);
    if (groupId && groupId !== "none") {
      formData.set("groupId", groupId);
    }
    formData.set("isHighlighted", highlighted ? "on" : "off");
    formData.set("isActive", active ? "on" : "off");
    formData.set("autoIcon", autoIcon ? "on" : "off");

    if (!scheduled) {
      formData.delete("scheduleStart");
      formData.delete("scheduleEnd");
    }

    startTransition(async () => {
      if (editing) {
        await updateLink(formData);
      } else {
        await createLink(formData);
      }
      router.refresh();
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? t("Links.editLink") : t("Links.addLink")}</DialogTitle>
          <DialogDescription>
            {editing ? t("Links.editSubtitle") : t("Links.addSubtitle")}
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
          {pageId && !editing ? <input type="hidden" name="pageId" value={pageId} /> : null}

          <FormField label={t("Common.title", "Title")} htmlFor="title" required>
            <Input
              id="title"
              name="title"
              defaultValue={editing?.title ?? ""}
              required
              maxLength={120}
              placeholder={t("Placeholders.titleInput")}
            />
          </FormField>

          <FormField label={urlLabel} htmlFor="url" required>
            <Input
              id="url"
              name="url"
              defaultValue={editing?.url ?? ""}
              required
              maxLength={2048}
              placeholder={urlPlaceholder || t("Placeholders.urlInput")}
            />
          </FormField>

          <FormField label={t("Common.description")} htmlFor="description">
            <Input
              id="description"
              name="description"
              defaultValue={editing?.description ?? ""}
              maxLength={300}
              placeholder={t("Placeholders.descriptionInput")}
            />
          </FormField>

          <FormField label={t("Common.imageUrl")} htmlFor="imageUrl">
            <Input
              id="imageUrl"
              name="imageUrl"
              defaultValue={editing?.imageUrl ?? ""}
              maxLength={2048}
              placeholder={t("Placeholders.imageUrlInput")}
            />
          </FormField>

          <FormField label={t("Links.linkType", "Type")}>
            <Select value={type} onValueChange={(v) => setType(v ?? "url")}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {LINK_TYPES.find((t) => t.value === type)?.label ?? "Link URL"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {LINK_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {groups.length > 0 && (
            <FormField label={t("Links.group", "Group (optional)")}>
              <Select value={groupId} onValueChange={(val) => setGroupId(val || "none")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("Links.noGroup", "No group")}>
                    {groupId === "none"
                      ? t("Links.noGroup", "No group")
                      : groups.find((g) => String(g.id) === groupId)?.title ?? t("Links.noGroup", "No group")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("Links.noGroup", "No group")}</SelectItem>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={String(g.id)}>
                      {g.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          )}

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={highlighted} onCheckedChange={setHighlighted} />
              {t("Links.highlighted", "Highlight")}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={active} onCheckedChange={setActive} />
              {t("Links.active", "Active")}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={autoIcon} onCheckedChange={setAutoIcon} />
              {t("Links.autoIcon", "Auto icon")}
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={scheduled} onCheckedChange={setScheduled} />
              {t("Links.schedule", "Schedule")}
            </label>
            {scheduled ? (
              <div className="flex flex-col gap-2">
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-xs text-muted-foreground">{t("Links.scheduleFrom", "Show from")}</span>
                  <Input
                    type="datetime-local"
                    name="scheduleStart"
                    defaultValue={
                      editing?.scheduleStart
                        ? editing.scheduleStart.replace(" ", "T").slice(0, 16)
                        : ""
                    }
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-xs text-muted-foreground">{t("Links.scheduleHide", "Hide after")}</span>
                  <Input
                    type="datetime-local"
                    name="scheduleEnd"
                    defaultValue={
                      editing?.scheduleEnd
                        ? editing.scheduleEnd.replace(" ", "T").slice(0, 16)
                        : ""
                    }
                  />
                </div>
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              {t("Common.cancel", "Cancel")}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? t("Common.saving", "Saving...") : t("Common.saveChanges", "Save changes")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
