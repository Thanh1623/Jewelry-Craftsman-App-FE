import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"

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
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { urlPaths } from "@/constants/urlPaths"

import { useAnswerRequestMutation } from "../hooks/use-answer-request-mutation"
import { requestDetailQueryOptions } from "../queries/request.queries"
import {
  answerDefaultValues,
  answerSchema,
  type AnswerFormInput,
} from "../schemas/answer.schema"
import { REQUEST_STATUS } from "../types/request.types"
import {
  formatDateTime,
  formatVnd,
  formatWeightGrams,
} from "../utils/format-request"
import { RequestStatusBadge } from "./RequestStatusBadge"

export function RequestDetailPage() {
  const { requestId } = useParams<{ requestId: string }>()
  const navigate = useNavigate()

  const { data: request, isPending, isError } = useQuery(
    requestDetailQueryOptions(requestId ?? "")
  )
  const answerMutation = useAnswerRequestMutation(requestId ?? "")

  const form = useForm<AnswerFormInput>({
    resolver: zodResolver(answerSchema),
    defaultValues: answerDefaultValues,
  })

  function onSubmit(values: AnswerFormInput) {
    answerMutation.mutate(values)
  }

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (isError || !request) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Không tìm thấy yêu cầu</CardTitle>
          <CardDescription>
            Yêu cầu này có thể đã bị xoá hoặc không tồn tại.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => navigate(urlPaths.home)}>
            Quay lại danh sách
          </Button>
        </CardContent>
      </Card>
    )
  }

  const isAnswered = request.status === REQUEST_STATUS.ANSWERED

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit"
        onClick={() => navigate(urlPaths.home)}
      >
        ← Quay lại danh sách
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle>{request.productName}</CardTitle>
            <RequestStatusBadge status={request.status} />
          </div>
          <CardDescription>
            Gửi lúc {formatDateTime(request.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <dl className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-muted/40 p-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">Trọng lượng</dt>
              <dd className="font-medium">
                {formatWeightGrams(request.productWeightGrams)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Công thợ</dt>
              <dd className="font-medium">
                {formatVnd(request.productLaborCost)}
              </dd>
            </div>
            {request.productBaseSize !== null && (
              <div>
                <dt className="text-muted-foreground">Size nền</dt>
                <dd className="font-medium">{request.productBaseSize}</dd>
              </div>
            )}
          </dl>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">
              Câu hỏi của khách hàng
            </span>
            <p className="rounded-2xl border border-border p-3 text-sm">
              {request.question}
            </p>
          </div>

          {request.customerNote && (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">
                Ghi chú thêm
              </span>
              <p className="rounded-2xl border border-border p-3 text-sm">
                {request.customerNote}
              </p>
            </div>
          )}

          {isAnswered ? (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">
                Câu trả lời
                {request.answeredAt &&
                  ` · ${formatDateTime(request.answeredAt)}`}
              </span>
              <p className="rounded-2xl border border-primary/30 bg-primary/5 p-3 text-sm">
                {request.answer}
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-3"
              >
                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Câu trả lời</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập câu trả lời cho khách hàng..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-fit"
                  disabled={answerMutation.isPending}
                >
                  {answerMutation.isPending
                    ? "Đang gửi..."
                    : "Gửi câu trả lời"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
