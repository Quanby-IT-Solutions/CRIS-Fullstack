"use client"

import { Cell, Pie, PieChart } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from 'react-i18next'

import { Skeleton } from "@/components/ui/skeleton"

interface GenderDistributionChartProps {
    totalMale: number
    totalFemale: number
    totalRegistrations: number
    name: string
    isLoading?: boolean  // Add this prop
}

const MALE_COLOR = "hsl(var(--chart-1))"
const FEMALE_COLOR = "hsl(var(--chart-5))"

export const GenderDistributionChart: React.FC<GenderDistributionChartProps> = ({
    totalMale,
    totalFemale,
    totalRegistrations,
    name,
    isLoading = false
}) => {
    const { t } = useTranslation()

    if (isLoading) {
        return (
            <Card className="lg:col-span-3 flex flex-col min-h-[400px]">
                <CardHeader>
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="flex-1 flex justify-center items-center">
                    <Skeleton className="rounded-full h-[250px] w-[250px]" />
                </CardContent>
                <CardFooter className="flex justify-around">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                </CardFooter>
            </Card>
        )
    }

    // Data for the donut chart
    const chartData = [
        { gender: t('male'), count: totalMale, fill: MALE_COLOR },
        { gender: t('female'), count: totalFemale, fill: FEMALE_COLOR },
    ]

    // Chart configuration
    const chartConfig = {
        count: {
            label: t('count'),
        },
        Male: {
            label: t('male'),
            color: MALE_COLOR,
        },
        Female: {
            label: t('female'),
            color: FEMALE_COLOR,
        },
    } satisfies ChartConfig

    const malePercentage = ((totalMale / totalRegistrations) * 100).toFixed(1)
    const femalePercentage = ((totalFemale / totalRegistrations) * 100).toFixed(1)

    const conclusion =
        name === "Birth"
            ? totalMale > totalFemale
                ? t('birth_conclusion_more_male')
                : totalFemale > totalMale
                    ? t('birth_conclusion_more_female')
                    : t('birth_conclusion_equal')
            : totalMale > totalFemale
                ? t('death_conclusion_more_male')
                : totalFemale > totalMale
                    ? t('death_conclusion_more_female')
                    : t('death_conclusion_equal')

    return (
        <Card className="lg:col-span-3 flex flex-col min-h-[400px]">
            <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-lg">
                    {name === "Birth" ? t('birth_gender_distribution') : t('death_gender_distribution')}
                </CardTitle>
                <CardDescription className="text-sm">
                    {name === "Birth" ? t('birth_registrations_by_gender') : t('death_registrations_by_gender')}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
                <ChartContainer config={chartConfig}>
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie data={chartData} dataKey="count" nameKey="gender" innerRadius={60} label>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>

                <div className="flex justify-around text-sm mt-4">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" />
                        <span className="text-muted-foreground">
                            {t('male')}: {malePercentage}% ({totalMale.toLocaleString()})
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" />
                        <span className="text-muted-foreground">
                            {t('female')}: {femalePercentage}% ({totalFemale.toLocaleString()})
                        </span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex-col gap-1 text-sm">
                <div className="leading-none text-muted-foreground">{t('last_6_months')}</div>
                <div className="text-center text-sm text-muted-foreground">
                    <strong>{t('conclusion')}:</strong> {conclusion}
                </div>
            </CardFooter>
        </Card>
    )
}
