import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard"

export default function OnboardingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-black p-4">
            <div className="mb-8 text-center space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                    Let's customize your kitchen
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Help us discover what you love (and what you hate).
                </p>
            </div>
            <OnboardingWizard />
        </div>
    )
}
