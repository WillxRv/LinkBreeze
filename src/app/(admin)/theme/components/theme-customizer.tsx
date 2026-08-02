"use client";

import { Save, Eye } from "lucide-react";
import type { ThemeRow } from "@/server/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ColorField, SelectField, ToggleField, SliderField } from "./field-controls";
import {
  FONT_OPTIONS,
  BG_TYPES,
  LINK_STYLES,
  SHADOW_STRENGTHS,
  HOVER_EFFECTS,
  BACKGROUND_ANGLES,
  FONT_WEIGHTS,
  BUTTON_SIZES,
  ALIGNMENTS,
  DENSITIES,
  REVEAL_ANIMATIONS,
  MODE_OPTIONS,
} from "../theme-constants";
import { useLanguage } from "@/components/providers/language-provider";

// ─── Section sub-components ────────────────────────────────────────────────

function BackgroundSection({ active }: { active: ThemeRow }) {
  const { t } = useLanguage();
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold">{t("Theme.background", "Background")}</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SelectField
          label={t("Theme.bgType", "Type")}
          name="backgroundType"
          defaultValue={active.backgroundType}
          options={BG_TYPES}
        />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="backgroundValue" className="text-xs text-muted-foreground">
            {t("Theme.bgValue", "Value (colors separated by commas)")}
          </Label>
          <Input
            id="backgroundValue"
            name="backgroundValue"
            defaultValue={active.backgroundValue ?? ""}
            placeholder="#1a1530,#2a2150"
            className="font-mono text-xs"
          />
        </div>
        <SelectField
          label={t("Theme.bgAngle", "Angle")}
          name="backgroundAngle"
          defaultValue={active.backgroundAngle}
          options={BACKGROUND_ANGLES}
        />
        {active.backgroundType === "image" ? (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="backgroundImageUrl" className="text-xs text-muted-foreground">
              {t("Theme.bgImageUrl", "Image URL")}
            </Label>
            <Input
              id="backgroundImageUrl"
              name="backgroundImageUrl"
              defaultValue={active.backgroundImageUrl ?? ""}
              placeholder="https://…"
              className="font-mono text-xs"
            />
          </div>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ColorField
          label={t("Theme.overlayColor", "Overlay color")}
          name="overlayColor"
          defaultValue={active.overlayColor}
        />
        <SliderField
          label={t("Theme.overlayOpacity", "Overlay opacity")}
          name="overlayOpacity"
          defaultValue={active.overlayOpacity ?? "0"}
          min={0}
          max={100}
          unit="%"
        />
      </div>
    </section>
  );
}

function ColorsSection({ active }: { active: ThemeRow }) {
  const { t } = useLanguage();
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{t("Theme.colors", "Colors")}</h3>
        <SelectField
          label=""
          name="mode"
          defaultValue={active.mode ?? "dark"}
          options={MODE_OPTIONS}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ColorField label={t("Theme.primaryColor", "Accent (primary)")} name="primaryColor" defaultValue={active.primaryColor} />
        <ColorField label={t("Theme.secondaryColor", "Secondary")} name="secondaryColor" defaultValue={active.secondaryColor} />
        <ColorField label={t("Theme.textColor", "Text")} name="textColor" defaultValue={active.textColor} />
        <ColorField label={t("Theme.mutedTextColor", "Muted text")} name="mutedTextColor" defaultValue={active.mutedTextColor} />
        <ColorField label={t("Theme.cardBackground", "Card background")} name="cardBackground" defaultValue={active.cardBackground} allowRgba />
        <ColorField label={t("Theme.cardBorderColor", "Card border")} name="cardBorderColor" defaultValue={active.cardBorderColor} allowRgba />
        <ColorField label={t("Theme.cardTextColor", "Card text")} name="cardTextColor" defaultValue={active.cardTextColor} />
      </div>
    </section>
  );
}

function TypographySection({ active }: { active: ThemeRow }) {
  const { t } = useLanguage();
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold">{t("Theme.typography", "Typography")}</h3>
      <div className="flex flex-wrap gap-1.5">
        {FONT_OPTIONS.map((font) => (
          <label key={font.id} className="cursor-pointer">
            <input
              type="radio"
              name="fontFamily"
              value={font.id}
              defaultChecked={active.fontFamily === font.id}
              className="peer sr-only"
            />
            <span
              className="inline-flex flex-col items-center gap-0.5 rounded-lg border border-border px-3 py-2 text-xs transition-all peer-checked:border-primary peer-checked:bg-primary/10 hover:border-primary/50"
            >
              <span className="text-base font-bold">{font.sample}</span>
              {font.label}
            </span>
          </label>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <SliderField
          label={t("Theme.fontScale", "Font scale")}
          name="fontScale"
          defaultValue={active.fontScale ?? "100"}
          min={80}
          max={150}
          unit="%"
        />
        <SelectField
          label={t("Theme.fontWeight", "Weight")}
          name="fontWeight"
          defaultValue={active.fontWeight ?? "500"}
          options={FONT_WEIGHTS}
        />
        <SliderField
          label={t("Theme.letterSpacing", "Letter spacing")}
          name="letterSpacing"
          defaultValue={active.letterSpacing ?? "0"}
          min={-2}
          max={5}
          step={0.5}
        />
      </div>
    </section>
  );
}

function CardStyleSection({ active }: { active: ThemeRow }) {
  const { t } = useLanguage();
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold">{t("Theme.cardStyle", "Card Style")}</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <SelectField
          label={t("Theme.linkStyle", "Link style")}
          name="linkStyle"
          defaultValue={active.linkStyle}
          options={LINK_STYLES}
        />
        <SelectField
          label={t("Theme.hoverEffect", "Hover effect")}
          name="hoverEffect"
          defaultValue={active.hoverEffect ?? active.animationType}
          options={HOVER_EFFECTS}
        />
        <SelectField
          label={t("Theme.buttonSize", "Button size")}
          name="buttonSize"
          defaultValue={active.buttonSize ?? "md"}
          options={BUTTON_SIZES}
        />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="radius" className="text-xs text-muted-foreground">
            {t("Theme.cornerRadius", "Corner radius")}
          </Label>
          <Input
            id="radius"
            name="radius"
            defaultValue={active.radius ?? "auto"}
            placeholder="auto, 0px, 8px, 9999px"
            className="font-mono text-xs"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="borderWidth" className="text-xs text-muted-foreground">
            {t("Theme.borderWidth", "Border width")}
          </Label>
          <Input
            id="borderWidth"
            name="borderWidth"
            defaultValue={active.borderWidth ?? "1px"}
            placeholder="0px, 1px, 2px, 3px"
            className="font-mono text-xs"
          />
        </div>
        <SelectField
          label={t("Theme.shadow", "Shadow")}
          name="shadowStrength"
          defaultValue={active.shadowStrength ?? "medium"}
          options={SHADOW_STRENGTHS}
        />
      </div>
    </section>
  );
}

function LayoutSection({ active }: { active: ThemeRow }) {
  const { t } = useLanguage();
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold">{t("Theme.layout", "Layout")}</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="containerWidth" className="text-xs text-muted-foreground">
            {t("Theme.containerWidth", "Container width")}
          </Label>
          <Input
            id="containerWidth"
            name="containerWidth"
            defaultValue={active.containerWidth ?? "540px"}
            placeholder="480px, 540px, 640px"
            className="font-mono text-xs"
          />
        </div>
        <SelectField
          label={t("Theme.alignment", "Alignment")}
          name="alignment"
          defaultValue={active.alignment ?? "center"}
          options={ALIGNMENTS}
        />
        <SelectField
          label={t("Theme.density", "Density")}
          name="density"
          defaultValue={active.density ?? "normal"}
          options={DENSITIES}
        />
      </div>
    </section>
  );
}

function EffectsSection({ active }: { active: ThemeRow }) {
  const { t } = useLanguage();
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold">{t("Theme.effects", "Effects")}</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ToggleField label={t("Theme.glow", "Glow")} name="glow" defaultValue={active.glow ?? "false"} />
        <ToggleField label={t("Theme.noiseTexture", "Noise texture")} name="noise" defaultValue={active.noise ?? "false"} />
        <ColorField label={t("Theme.glowColor", "Glow color")} name="glowColor" defaultValue={active.glowColor} />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="blur" className="text-xs text-muted-foreground">
            {t("Theme.glassBlur", "Glass blur")}
          </Label>
          <Input
            id="blur"
            name="blur"
            defaultValue={active.blur ?? "12px"}
            placeholder="0px, 8px, 12px, 20px"
            className="font-mono text-xs"
          />
        </div>
      </div>
      <SelectField
        label={t("Theme.revealAnimation", "Reveal animation")}
        name="animationType"
        defaultValue={active.animationType ?? "lift"}
        options={REVEAL_ANIMATIONS}
      />
    </section>
  );
}

// ─── Main customizer component ─────────────────────────────────────────────

interface ThemeCustomizerProps {
  active: ThemeRow;
  onCustomize: (formData: FormData) => void;
  customPending: boolean;
  customError: string | null;
  isCustom: boolean;
}

export function ThemeCustomizer({
  active,
  onCustomize,
  customPending,
  customError,
  isCustom,
}: ThemeCustomizerProps) {
  const { t } = useLanguage();

  return (
    <>
      <Separator />
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {t("Theme.customiseTitle", `Customise "${active.name}"`).replace("{name}", active.name)}
              </CardTitle>
              <CardDescription>
                {t("Theme.customiseDesc", "Full control over every visual aspect. Changes apply instantly.")}
              </CardDescription>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener"
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-medium transition-colors hover:bg-accent"
            >
              <Eye className="size-4" />
              {t("Theme.preview", "Preview")}
            </a>
          </div>
        </CardHeader>
        <form action={onCustomize}>
          <CardContent className="flex flex-col gap-6">
            <BackgroundSection active={active} />
            <Separator />
            <ColorsSection active={active} />
            <Separator />
            <TypographySection active={active} />
            <Separator />
            <CardStyleSection active={active} />
            <Separator />
            <LayoutSection active={active} />
            <Separator />
            <EffectsSection active={active} />
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            {customError ? (
              <p className="w-full text-xs text-destructive">{customError}</p>
            ) : null}
            <div className="flex w-full items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {isCustom
                  ? t("Theme.editingCustom", "Editing a custom theme")
                  : t("Theme.editingPreset", "Editing a preset — duplicate it first to keep changes separate")}
              </p>
              <Button type="submit" disabled={customPending}>
                <Save className="size-4" />
                {customPending ? t("Theme.saving", "Saving…") : t("Theme.saveChanges", "Save changes")}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
