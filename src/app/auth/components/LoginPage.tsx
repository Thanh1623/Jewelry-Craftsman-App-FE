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
  CardDescription,
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
    <Card>
      <CardHeader>
        <CardTitle>Đăng nhập</CardTitle>
        <CardDescription>Nhập email và mật khẩu để tiếp tục.</CardDescription>
        <p className="rounded-2xl border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          Tài khoản demo: <span className="font-medium">tho@jewelry.local</span> /{" "}
          <span className="font-medium">Tho123456!</span>
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...field}
                    />
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
                    <Input
                      type="password"
                      placeholder="••••••"
                      autoComplete="current-password"
                      {...field}
                    />
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

        <Button asChild variant="link" className="mt-4 px-0">
          <Link to={urlPaths.register}>Chưa có tài khoản? Đăng ký</Link>
        </Button>

        <div className="mt-4 rounded-2xl bg-muted/60 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Tài khoản demo</p>
          <p>Thợ: tho@jewelry.local / Tho123456!</p>
          <p>Bật thông báo sau khi đăng nhập để nhận yêu cầu mới (Web Push).</p>
        </div>
      </CardContent>
    </Card>
  )
}
