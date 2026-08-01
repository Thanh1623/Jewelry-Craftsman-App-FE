import { z } from "zod"

export const answerSchema = z.object({
  answer: z.string().trim().min(1, "Vui lòng nhập câu trả lời."),
})

export type AnswerFormInput = z.input<typeof answerSchema>
export type AnswerFormValues = z.output<typeof answerSchema>

export const answerDefaultValues: AnswerFormInput = {
  answer: "",
}
