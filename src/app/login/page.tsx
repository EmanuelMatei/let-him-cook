import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function LoginPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const searchParams = await props.searchParams
    const error = searchParams.error

    return (
        <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-black p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login / Sign Up</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <div className="flex flex-col gap-2 mt-4">
                            <Button formAction={login} className="w-full bg-orange-600 hover:bg-orange-700">Sign in</Button>
                            <Button formAction={signup} variant="outline" className="w-full">Sign up</Button>
                        </div>
                        {error && (
                            <div className="mt-4 p-3 rounded-md bg-red-100 text-red-600 text-sm font-medium dark:bg-red-900/30 dark:text-red-400">
                                {String(error)}
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
