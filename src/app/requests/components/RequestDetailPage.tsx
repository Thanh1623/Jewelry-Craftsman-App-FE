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
    <div className="flex flex-col gap-3">
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-fit px-0 text-xs"
        onClick={() => navigate(urlPaths.home)}
      >
        ← Danh sách
      </Button>

      <Card className="shadow-none">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base">{request.productName}</CardTitle>
            <RequestStatusBadge status={request.status} />
          </div>
          <CardDescription className="text-xs">
            {formatDateTime(request.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {(request.productImageUrl || request.referenceImageUrl) && (
            <div className="grid grid-cols-2 gap-2">
              {request.productImageUrl && (
                <div className="overflow-hidden border border-border">
                  <p className="bg-muted px-2 py-1 text-[11px] text-muted-foreground">SP</p>
                  <img
                    src={request.productImageUrl}
                    alt={request.productName}
                    className="aspect-square w-full object-cover"
                  />
                </div>
              )}
              {request.referenceImageUrl && (
                <div className="overflow-hidden border border-border">
                  <p className="bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                    Tham chiếu
                  </p>
                  <img
                    src={request.referenceImageUrl}
                    alt="Ảnh tham chiếu"
                    className="aspect-square w-full object-cover"
                  />
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            {formatWeightGrams(request.productWeightGrams)} · Công {formatVnd(request.productLaborCost)}
            {request.productBaseSize !== null ? ` · Size ${request.productBaseSize}` : ""}
          </p>

          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">Câu hỏi</p>
            <p className="border border-border p-2 text-sm">{request.question}</p>
          </div>

          {request.customerNote && (
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Ghi chú sale</p>
              <p className="border border-border p-2 text-sm">{request.customerNote}</p>
            </div>
          )}

          {isAnswered ? (
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Trả lời{request.answeredAt ? ` · ${formatDateTime(request.answeredAt)}` : ""}
              </p>
              <p className="border border-border bg-muted/40 p-2 text-sm">{request.answer}</p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trả lời</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập câu trả lời..."
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-fit" disabled={answerMutation.isPending}>
                  {answerMutation.isPending ? "Đang gửi..." : "Gửi"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
