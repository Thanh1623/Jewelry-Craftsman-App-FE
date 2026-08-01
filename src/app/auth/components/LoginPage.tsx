import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"

import { useLoginMutation } from "@/app/auth/hooks/use-auth-mutations"
import {
  loginDefaultValues,
  loginSchema,
  type LoginFormInput,
} from "@/app/auth/schemas/login.schema"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { urlPaths } from "@/constants/urlPaths"

const showDemoHints = import.meta.env.DEV

export function LoginPage() {
  const loginMutation = useLoginMutation()

  const form = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  })

  function onSubmit(values: LoginFormInput) {
    loginMutation.mutate(values)
  }

  return (
    <Card className="border-border shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Đăng nhập · Thợ</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </Form>

        <Button asChild variant="link" className="mt-2 h-auto px-0 text-xs">
          <Link to={urlPaths.register}>Đăng ký</Link>
        </Button>

        {showDemoHints && (
          <p className="mt-2 text-xs text-muted-foreground">
            Demo: tho@jewelry.local / Tho123456!
          </p>
        )}
      </CardContent>
    </Card>
  )
}
