import { CurrentUser } from "@infra/auth/current-user-decorator";
import type { UserPayload } from "@infra/auth/jwt.strategy";
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CommentOnAnswerUseCase } from "@domain/forum/application/use-cases/comment-on-answer";

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
});

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>;

@Controller("/answers/:answerId/comments")
export class CommentOnAnswerController {
  constructor(private commentOnAnswerUseCase: CommentOnAnswerUseCase) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(commentOnAnswerBodySchema))
    body: CommentOnAnswerBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("answerId") answerId: string,
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.commentOnAnswerUseCase.execute({
      authorId: userId,
      answerId,
      content,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
