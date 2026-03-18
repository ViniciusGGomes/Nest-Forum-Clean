import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { FetchAnswerCommentsUseCase } from "@domain/forum/application/use-cases/fetch-answer-comments";
import { CommentPresenter } from "../presenters/comment-presenter";

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>;

@Controller("/answers/:answerId/comments")
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerCommentsUseCase: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Query("page", new ZodValidationPipe(pageQueryParamsSchema))
    page: PageQueryParamsSchema,
    @Param("answerId") answerId: string,
  ) {
    const result = await this.fetchAnswerCommentsUseCase.execute({
      page,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const answerComments = result.value.answerComments;

    return {
      comments: answerComments.map(CommentPresenter.toHttp),
    };
  }
}
