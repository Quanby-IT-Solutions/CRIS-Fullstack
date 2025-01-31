import { Separator } from '@/components/ui/separator'
import { BirthReport } from '@/components/custom/reports/birth-report'
import { DeathReport } from '@/components/custom/reports/death-report'
import { MarriageReport } from '@/components/custom/reports/marriage-report'
import { DashboardHeader } from '@/components/custom/dashboard/dashboard-header'

export default function ProfilePage() {
    return (
        <>
            <DashboardHeader
                breadcrumbs={[
                    { label: 'Reports', href: '/reports', active: true },
                ]}
            />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <BirthReport />
                <DeathReport />
                <MarriageReport />
                <Separator />
                <div>
                    Note:
                    Create detailed reports on civil registry document requests, processing times, and user activity.
                </div>
            </div>
        </>
    )
}