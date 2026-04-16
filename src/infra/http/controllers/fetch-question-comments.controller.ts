import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { FetchQuestionCommentsUseCase } from "@domain/forum/application/use-cases/fetch-question-comments";
import { CommentWithAuthorPresenter } from "../presenters/comment-with-author-presenter";

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>;

@Controller("/questions/:questionId/comments")
export class FetchQuestionCommentsController {
  constructor(
    private fetchQuestionCommentsUseCase: FetchQuestionCommentsUseCase,
  ) {}

  @Get()
  async handle(
    @Query("page", new ZodValidationPipe(pageQueryParamsSchema))
    page: PageQueryParamsSchema,
    @Param("questionId") questionId: string,
  ) {
    const result = await this.fetchQuestionCommentsUseCase.execute({
      page,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const comments = result.value.comments;

    return {
      comments: comments.map(CommentWithAuthorPresenter.toHttp),
    };
  }
}
