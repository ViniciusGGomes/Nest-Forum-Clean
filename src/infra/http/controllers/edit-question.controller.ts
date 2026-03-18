import { EditQuestionUseCase } from "@domain/forum/application/use-cases/edit-question";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import type { UserPayload } from "@infra/auth/jwt.strategy";
import { CurrentUser } from "@infra/auth/current-user-decorator";

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

@Controller("/questions/:id")
export class EditQuestionController {
  constructor(private editQuestionUseCase: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(editQuestionBodySchema))
    body: EditQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("id") questionId: string,
  ) {
    const { title, content } = body;
    const userId = user.sub;

    const result = await this.editQuestionUseCase.execute({
      authorId: userId,
      title,
      content,
      questionId,
      attachmentsIds: [],
    });

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
