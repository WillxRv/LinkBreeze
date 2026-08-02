import Link from "next/link";
import {
  Eye,
  MousePointerClick,
  TrendingUp,
  Link as LinkIcon,
  Download,
} from "lucide-react";
import {
  getDashboardStats,
  getAllLinks,
  getAllPages,
  getAnalyticsBreakdown,
  type AnalyticsRange,
  type BreakdownEntry,
} from "@/server/queries";
import { checkForUpdates } from "@/lib/update-check";
import { UpdateChecker } from "@/components/admin/UpdateChecker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ViewsChart } from "./views-chart";
import { RangePicker } from "./range-picker";

import { translate } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const VALID_RANGES: AnalyticsRange[] = ["7d", "30d", "90d", "all"];

function parseRange(value?: string): AnalyticsRange {
  return value && (VALID_RANGES as string[]).includes(value)
    ? (value as AnalyticsRange)
    : "7d";
}

function BreakdownCard({
  title,
  description,
  entries,
}: {
  title: string;
  description: string;
  entries: BreakdownEntry[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">{translate(null, "Analytics.noDataYet", "No data yet.")}</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {entries.map((e) => {
              const max = entries[0].count || 1;
              const pct = Math.round((e.count / max) * 100);
              return (
                <li key={e.label} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate">{e.label}</span>
                    <span className="shrink-0 font-medium tabular-nums">{e.count}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-[var(--aurora-grad)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; page?: string }>;
}) {
  const { range: rangeParam, page: pageParam } = await searchParams;
  const range = parseRange(rangeParam);

  // Resolve active page for page-scoped analytics.
  const allPages = await getAllPages();
  let pageId: number | undefined;
  if (pageParam) {
    const found = allPages.find((p) => p.id === Number(pageParam));
    if (found) pageId = found.id;
  }
  if (pageId === undefined) {
    const def = allPages.find((p) => p.isDefault) ?? allPages[0];
    pageId = def?.id;
  }

  const [stats, links, breakdown, updateResult] = await Promise.all([
    getDashboardStats(range, pageId),
    getAllLinks(pageId),
    getAnalyticsBreakdown(range, pageId),
    checkForUpdates(),
  ]);

  const activeCount = links.filter((l) => l.isActive).length;

  const cards = [
    { label: translate(null, "Analytics.views", "Views"), value: stats.totalViews.toLocaleString(), icon: Eye, hint: `${stats.uniqueVisitors.toLocaleString()} ${translate(null, "Analytics.uniqueVisitors", "unique visitors")}` },
    { label: translate(null, "Analytics.clicks", "Clicks"), value: stats.totalClicks.toLocaleString(), icon: MousePointerClick, hint: translate(null, "Analytics.clicksInRange", "Link clicks in range") },
    { label: translate(null, "Analytics.ctr", "Click-through rate"), value: `${stats.ctr}%`, icon: TrendingUp, hint: translate(null, "Analytics.ctrHint", "Clicks ÷ views") },
    { label: translate(null, "Analytics.activeLinks", "Active links"), value: activeCount.toString(), icon: LinkIcon, hint: `${links.length} ${translate(null, "Analytics.total", "total")}` },
  ];

  return (
    <div className="flex flex-col gap-6">
      <UpdateChecker initialResult={updateResult} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {translate(null, "Analytics.title", "Dashboard")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {translate(null, "Analytics.subtitle", "Analytics for the selected range")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`/api/analytics/export?range=${range}&metric=views`}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Download className="size-4" />
            <span className="hidden sm:inline">{translate(null, "Analytics.exportCsv", "Export CSV")}</span>
          </a>
          <RangePicker current={range} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardDescription>{c.label}</CardDescription>
                <span className="flex size-8 items-center justify-center rounded-lg bg-violet/15 text-lavender">
                  <c.icon className="size-4" />
                </span>
              </div>
              <CardTitle className="text-3xl">{c.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{c.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{translate(null, "Analytics.viewsOverTime", "Views over time")}</CardTitle>
            <CardDescription>{translate(null, "Analytics.viewsOverTimeSubtitle", "Daily views and clicks")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ViewsChart data={stats.viewsPerDay} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{translate(null, "Analytics.topLinks", "Top links")}</CardTitle>
            <CardDescription>{translate(null, "Analytics.topLinksSubtitle", "Most clicked in range")}</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.topLinks.length === 0 ? (
              <p className="text-sm text-muted-foreground">{translate(null, "Analytics.noClicksYet", "No clicks yet.")}</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {stats.topLinks.map((link, i) => {
                  const max = stats.topLinks[0]?.clicks || 1;
                  const pct = Math.round((link.clicks / max) * 100);
                  return (
                    <li key={link.id} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <Link
                          href={`/links/${link.id}`}
                          className="flex items-center gap-2 truncate text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Badge variant="secondary" className="font-mono">
                            {i + 1}
                          </Badge>
                          <span className="truncate text-foreground">{link.title}</span>
                        </Link>
                        <span className="shrink-0 font-medium tabular-nums">
                          {link.clicks}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-[var(--aurora-grad)] transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <BreakdownCard
          title={translate(null, "Analytics.topReferrers", "Top referrers")}
          description={translate(null, "Analytics.topReferrersSub", "Where views came from")}
          entries={breakdown.referrers}
        />
        <BreakdownCard
          title={translate(null, "Analytics.devices", "Devices")}
          description={translate(null, "Analytics.devicesSub", "Views by device type")}
          entries={breakdown.devices}
        />
        <BreakdownCard
          title={translate(null, "Analytics.countries", "Countries")}
          description={translate(null, "Analytics.countriesSub", "Views by country")}
          entries={breakdown.countries}
        />
      </div>
    </div>
  );
}
