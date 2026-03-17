import { EditAnswerUseCase } from "@domain/forum/application/use-cases/edit-answer";
import { CurrentUser } from "@infra/auth/current-user-decorator";
import type { UserPayload } from "@infra/auth/jwt.strategy";
import { BadRequestException, Body, Controller, HttpCode, Param, Put } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const editAnswerBodySchema = z.object({
  content: z.string(),
});

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>;

@Controller("/answer/:id")
export class EditAnswerController {
  constructor(private editAnswerUseCase: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(editAnswerBodySchema))
    body: EditAnswerBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("id") answerId: string,
  ) {
    const {content} = body
    const userId = user.sub

    const result = await this.editAnswerUseCase.execute({
      authorId: userId,
      answerId,
      content,
      attachmentsIds: []
    })

    if(result.isLeft()){
      throw new BadRequestException()
    }
  }
}
