import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AppSidebar } from '@/components/custom/sidebar/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

type ChildrenProps = {
  children: React.ReactNode
}

export default async function AuthLayout({ children }: ChildrenProps) {

  const session = await auth()
  if (!session) redirect("/")

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className='flex-1'>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}