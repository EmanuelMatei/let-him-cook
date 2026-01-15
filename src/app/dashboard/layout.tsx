import { Sidebar } from "@/components/dashboard/Sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-black">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                <div className="p-8 mx-auto max-w-7xl">
                    <header className="mb-8 flex items-center justify-between">
                        <div>
                            {/* We can make this dynamic or simple welcome message, 
                                but since Sidebar has the logo, maybe just page title here or nothing? 
                                Let's keep it clean since sidebar has logo.
                            */}
                        </div>
                        <div className="text-sm text-zinc-500">
                            Welcome back, Chef
                        </div>
                    </header>
                    {children}
                </div>
            </div>
        </div>
    )
}
