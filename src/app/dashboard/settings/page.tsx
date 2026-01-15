import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SettingsForm } from "@/components/dashboard/SettingsForm"

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: { preferences: true }
    })

    if (!dbUser) {
        // Should not happen if logged in correctly, but handle grace
        return <div>User not found</div>
    }

    const initialData = {
        restrictions: dbUser.preferences?.dietaryRestrictions || [],
        allergies: dbUser.preferences?.excludedIngredients || [],
        favorites: dbUser.preferences?.likedIngredients || [],
        name: dbUser.name,
        surname: dbUser.surname,
        dateOfBirth: dbUser.dateOfBirth,
        email: dbUser.email
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Settings</h2>
                <p className="text-zinc-500">Manage your profile and kitchen preferences.</p>
            </div>

            <SettingsForm initialData={initialData} />
        </div>
    )
}
