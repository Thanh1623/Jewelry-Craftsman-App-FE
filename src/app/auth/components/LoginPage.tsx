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
    <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm shadow-stone-200/50">
      <h1 className="text-base font-semibold text-stone-800">Đăng nhập</h1>
      <p className="mt-0.5 text-xs text-stone-500">Dành cho thợ chế tác</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    className="rounded-xl border-stone-200"
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
                <FormLabel className="text-xs">Mật khẩu</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    className="rounded-xl border-stone-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="mt-1 h-10 rounded-full bg-amber-500 hover:bg-amber-600"
          >
            {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      </Form>

      <Button asChild variant="link" className="mt-3 h-auto px-0 text-xs text-stone-500">
        <Link to={urlPaths.register}>Đăng ký tài khoản thợ</Link>
      </Button>

      {showDemoHints && (
        <p className="mt-3 rounded-xl bg-stone-50 px-3 py-2 text-[11px] text-stone-500">
          Demo: tho@jewelry.local / Tho123456!
        </p>
      )}
    </div>
  )
}
