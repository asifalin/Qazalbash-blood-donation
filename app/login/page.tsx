"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { login } from "@/redux/features/auth-slice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { RootState } from "@/redux/store"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Fixed credentials as requested
    if (email === "qazalbashbloodfoundation@gmail.com" && password === "Qazalbash@512") {
      dispatch(login({ email }))
      router.push("/dashboard")
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <>
      {/* Header Section */}
      <div className="bg-red-900 font-bold text-white text-2xl text-center overflow-hidden">
        <h1>Qazalbash Blood Donation Gilgit Baltistan</h1>
        <div className="overflow-hidden whitespace-nowrap">
          <div className="animate-scroll inline-block">
            Qazalbash Blood Donation ke saath mil kar insaniyat ki khidmat mein kadam uthayein,
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div className="flex  justify-center bg-gray-50 py-16 overflow-hidden">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Qazalbash Blood Donor Management
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to login
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password + Show Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="flex items-center space-x-2">
                  <input
                    id="show-password"
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                  />
                  <Label
                    htmlFor="show-password"
                    className="text-sm cursor-pointer select-none"
                  >
                    Show password
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-red-800 hover:bg-red-900 text-white"
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
