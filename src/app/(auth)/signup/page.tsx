import Link from 'next/link'
import { Newspaper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignupPage() {
  return (
    <div className="w-full max-w-md">
      <div className="flex justify-center mb-6">
        <Link href="/" className="flex items-center gap-2 font-headline text-3xl tracking-wider text-primary">
          <Newspaper className="h-8 w-8" />
          <span>NewsBlend</span>
        </Link>
      </div>
      <Card className="glass">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-headline tracking-wide">Create an Account</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input id="full-name" placeholder="Alex Ray" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full" asChild>
              <Link href="/onboarding">Create an account</Link>
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
