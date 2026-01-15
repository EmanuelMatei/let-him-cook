"use server"

import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { OnboardingData } from "@/app/onboarding/actions"

export async function updatePreferencesAction(data: OnboardingData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("Unauthorized")
    }

    try {
        // Update User Profile
        await prisma.user.update({
            where: { id: user.id },
            data: {
                name: data.firstName,
                surname: data.surname,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null
            }
        })

        // Update Preferences
        await prisma.userPreference.upsert({
            where: { userId: user.id },
            update: {
                dietaryRestrictions: data.dietaryRestrictions,
                excludedIngredients: data.ingredientsToAvoid,
                likedIngredients: data.lovedIngredients
            },
            create: {
                userId: user.id,
                dietaryRestrictions: data.dietaryRestrictions,
                excludedIngredients: data.ingredientsToAvoid,
                likedIngredients: data.lovedIngredients
            }
        })

        revalidatePath("/dashboard")
        return { success: true }
    } catch (error) {
        console.error("Failed to update preferences:", error)
        return { success: false, error: "Failed to update preferences" }
    }
}
