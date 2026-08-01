import {
  ArrowLeftIcon,
  CheckCheckIcon,
  ImagePlusIcon,
  SendIcon,
  XIcon,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { urlPaths } from "@/constants/urlPaths"
import { cn } from "@/lib/utils"
import { getApiErrorMessage } from "@/lib/get-api-error-message"
import { useAuthStore } from "@/stores/auth-store"

import { usePostRequestMessageMutation } from "../hooks/use-post-request-message-mutation"
import { requestDetailQueryOptions } from "../queries/request.queries"
import { uploadImageRequest } from "../services/request.service"
import {
  MESSAGE_SENDER,
  REQUEST_STATUS,
  type RequestMessage,
} from "../types/request.types"
import {
  formatDateTime,
  formatVnd,
  formatWeightGrams,
} from "../utils/format-request"
import { RequestStatusBadge } from "./RequestStatusBadge"

function MessageBubble({ message }: { message: RequestMessage }) {
  const isShop = message.sender === MESSAGE_SENDER.SHOP
  const showText = message.content && message.content !== "[Ảnh đính kèm]"
  const time = new Date(message.createdAt).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-1",
        isShop ? "items-start" : "items-end"
      )}
    >
      <div
        className={cn(
          "max-w-[82%] overflow-hidden rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm",
          isShop
            ? "rounded-tl-md border border-stone-200/80 bg-white text-stone-800"
            : "rounded-tr-md bg-amber-500 text-white shadow-amber-500/15"
        )}
      >
        {message.imageUrl && (
          <a
            href={message.imageUrl}
            target="_blank"
            rel="noreferrer"
            className={cn("block", showText && "mb-2")}
          >
            <img
              src={message.imageUrl}
              alt="Đính kèm"
              className="max-h-56 w-full rounded-xl object-cover"
            />
          </a>
        )}
        {showText && <p className="whitespace-pre-wrap">{message.content}</p>}
        <p
          className={cn(
            "mt-1 text-right text-[10px] tabular-nums",
            isShop ? "text-stone-400" : "text-white/70"
          )}
        >
          {time}
        </p>
      </div>
    </div>
  )
}

export function RequestDetailPage() {
  const { requestId } = useParams<{ requestId: string }>()
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const [text, setText] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const { data: request, isPending, isError } = useQuery(
    requestDetailQueryOptions(requestId ?? "")
  )
  const postMessageMutation = usePostRequestMessageMutation(requestId ?? "")

  const messages = request?.messages ?? []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  async function handlePickImage(file: File | undefined) {
    if (!file) {
      return
    }
    if (file.size > 2_000_000) {
      toast.error("Ảnh tối đa 2MB.")
      return
    }
    setIsUploading(true)
    try {
      const { url } = await uploadImageRequest(file)
      setImageUrl(url)
      setImagePreview(url)
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Không tải được ảnh."))
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  function clearImage() {
    setImageUrl(null)
    setImagePreview(null)
  }

  function send(sendToShop: boolean) {
    const content = text.trim()
    if (!content && !imageUrl) {
      toast.error("Nhập nội dung hoặc đính kèm ảnh.")
      return
    }
    postMessageMutation.mutate(
      {
        content: content || undefined,
        imageUrl: imageUrl ?? undefined,
        sendToShop,
      },
      {
        onSuccess: () => {
          setText("")
          clearImage()
        },
      }
    )
  }

  if (isPending) {
    return (
      <div className="flex h-full flex-col gap-0 overflow-hidden bg-white">
        <Skeleton className="h-14 w-full rounded-none" />
        <Skeleton className="min-h-0 flex-1 w-full rounded-none" />
      </div>
    )
  }

  if (isError || !request) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
        <p className="text-sm text-stone-500">Không tìm thấy yêu cầu.</p>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => navigate(urlPaths.home)}
        >
          Quay lại danh sách
        </Button>
      </div>
    )
  }

  const isAnswered = request.status === REQUEST_STATUS.ANSWERED
  const busy = postMessageMutation.isPending || isUploading
  const canSend = Boolean(text.trim() || imageUrl)

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white shadow-sm shadow-stone-200/50 sm:rounded-none">
      <header className="flex shrink-0 items-center gap-2 border-b border-stone-200/80 bg-white/95 px-2 py-2 backdrop-blur-md sm:px-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 shrink-0 rounded-full text-stone-600"
          onClick={() => navigate(urlPaths.home)}
          aria-label="Quay lại"
        >
          <ArrowLeftIcon className="size-4" />
        </Button>

        {request.productImageUrl ? (
          <img
            src={request.productImageUrl}
            alt=""
            className="size-10 shrink-0 rounded-xl object-cover ring-1 ring-black/5"
          />
        ) : (
          <div className="size-10 shrink-0 rounded-xl bg-stone-100" />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-stone-800">
              {request.productName}
            </p>
            <RequestStatusBadge status={request.status} />
          </div>
          <p className="truncate text-[11px] text-stone-500">
            {formatWeightGrams(request.productWeightGrams)} · Công{" "}
            {formatVnd(request.productLaborCost)}
            {request.productBaseSize !== null
              ? ` · Size ${request.productBaseSize}`
              : ""}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="hidden h-8 rounded-full text-[11px] text-stone-400 sm:inline-flex"
          onClick={logout}
        >
          Đăng xuất
        </Button>
      </header>

      <div
        ref={scrollRef}
        className="chat-surface min-h-0 flex-1 space-y-2.5 overflow-y-auto px-3 py-4"
      >
        <p className="pb-1 text-center text-[10px] text-stone-400">
          {formatDateTime(request.createdAt)} · Hội thoại với shop
        </p>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>

      {isAnswered ? (
        <div className="flex shrink-0 items-center justify-center gap-2 border-t border-stone-200/80 bg-stone-50 px-4 py-3.5 text-xs text-stone-500">
          <CheckCheckIcon className="size-3.5 text-amber-600" />
          Đã gửi về shop
          {request.answeredAt ? ` · ${formatDateTime(request.answeredAt)}` : ""}
        </div>
      ) : (
        <div className="shrink-0 space-y-2 border-t border-stone-200/80 bg-white px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
          {imagePreview && (
            <div className="relative w-fit">
              <img
                src={imagePreview}
                alt="Xem trước"
                className="h-16 w-16 rounded-xl object-cover ring-1 ring-stone-200"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-stone-800 text-white"
                aria-label="Gỡ ảnh"
              >
                <XIcon className="size-3" />
              </button>
            </div>
          )}

          <div className="flex items-end gap-1.5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) => void handlePickImage(event.target.files?.[0])}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={busy}
              className="size-10 shrink-0 rounded-full border-stone-200"
              aria-label="Đính kèm ảnh"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlusIcon className="size-4 text-stone-600" />
            </Button>
            <Textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Nhập trả lời…"
              disabled={busy}
              rows={1}
              className="max-h-32 min-h-10 flex-1 resize-none rounded-2xl border-stone-200 bg-stone-50/80 px-3.5 py-2.5 text-sm"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  send(false)
                }
              }}
            />
            <Button
              type="button"
              size="icon"
              disabled={busy || !canSend}
              className="size-10 shrink-0 rounded-full bg-stone-700 hover:bg-stone-800"
              aria-label="Gửi vào hội thoại"
              title="Gửi vào hội thoại (chưa gửi shop)"
              onClick={() => send(false)}
            >
              <SendIcon className="size-4" />
            </Button>
          </div>

          <Button
            type="button"
            disabled={busy || !canSend}
            className="h-10 w-full rounded-full bg-amber-500 text-sm font-medium text-white shadow-sm shadow-amber-500/20 hover:bg-amber-600"
            onClick={() => send(true)}
          >
            {postMessageMutation.isPending
              ? "Đang gửi…"
              : "Gửi trả lời về shop"}
          </Button>
          <p className="text-center text-[10px] text-stone-400">
            Enter gửi trong chat · nút dưới gửi chính thức về sale
          </p>
        </div>
      )}
    </div>
  )
}
