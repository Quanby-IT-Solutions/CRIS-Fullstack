"use client"

import { useEffect, useState } from "react"
import { Icons } from "@/components/ui/icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentMonthRegistrations, getPreviousMonthRegistrations } from "@/hooks/count-metrics"
import { useTranslation } from "react-i18next"

interface MetricItem {
  model: "baseRegistryForm" | "birthCertificateForm" | "deathCertificateForm" | "marriageCertificateForm"
  titleKey: string
  icon: JSX.Element
}

interface Metric {
  titleKey: string
  currentCount: number
  percentageChange: number
  icon: JSX.Element
}

const METRIC_ITEMS: MetricItem[] = [
  {
    model: "baseRegistryForm",
    titleKey: "metrics.total_registrations",
    icon: <Icons.user className="h-4 w-4 text-muted-foreground" />
  },
  {
    model: "birthCertificateForm",
    titleKey: "metrics.birth_certificates",
    icon: <Icons.cake className="h-4 w-4 text-muted-foreground" />
  },
  {
    model: "deathCertificateForm",
    titleKey: "metrics.death_certificates",
    icon: <Icons.notebookText className="h-4 w-4 text-muted-foreground" />
  },
  {
    model: "marriageCertificateForm",
    titleKey: "metrics.marriage_certificates",
    icon: <Icons.gem className="h-4 w-4 text-muted-foreground" />
  },
]

export default function MetricsDashboard() {
  const { t } = useTranslation()
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [selectedMetric, setSelectedMetric] = useState<string>("metrics.total_registrations") // Default selection
  const [error, setError] = useState<string>("")

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const data = await Promise.all(
          METRIC_ITEMS.map(async ({ model, titleKey, icon }) => {
            const [currentCount, previousCount] = await Promise.all([
              getCurrentMonthRegistrations(model),
              getPreviousMonthRegistrations(model)
            ])

            const percentageChange = previousCount === 0
              ? 100
              : ((currentCount - previousCount) / previousCount) * 100

            return {
              titleKey,
              currentCount,
              percentageChange,
              icon
            }
          })
        )

        setMetrics(data)
      } catch (err) {
        setError(t("metrics.fetch_error"))
        console.error("Error fetching metrics:", err)
      }
    }

    void fetchMetrics()
  }, [t])

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card
          key={metric.titleKey}
          className={`cursor-pointer transition-all ${
            selectedMetric === metric.titleKey
              ? "dark:bg-chart-1/55 bg-chart-3" // Selected metric
              : "bg-transparent hover:bg-muted" // Unselected metric (transparent + hover effect)
          }`}
          onClick={() => setSelectedMetric(metric.titleKey)} // Set selected metric on click
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t(metric.titleKey)}
            </CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.currentCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {metric.percentageChange > 0 ? "+" : ""}
              {metric.percentageChange.toFixed(1)}% {t("metrics.from_last_month")}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
