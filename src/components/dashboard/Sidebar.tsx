"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Heart, Settings, LogOut, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOutAction } from "@/app/login/actions"
import { AdBanner } from "@/components/ads/AdBanner"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard
    },
    {
        title: "My Favorites",
        href: "/dashboard/favorites",
        icon: Heart
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings
    }
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-white dark:bg-zinc-950 dark:border-zinc-800">
            <div className="p-6">
                <div className="flex items-center gap-2 font-bold text-xl text-orange-600">
                    <ChefHat className="h-6 w-6" />
                    <span>Let Him Cook</span>
                </div>
            </div>

            <nav className="flex-1 space-y-1 px-4">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                                ? "bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-500"
                                : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                }`}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t dark:border-zinc-800 space-y-4">
                <AdBanner slot="sidebar-slot" className="w-[200px] h-[200px] mx-auto rounded-md" format="rectangle" />
                <form action={signOutAction}>
                    <Button variant="ghost" className="w-full justify-start text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 gap-3">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </form>
            </div>
        </div>
    )
}
