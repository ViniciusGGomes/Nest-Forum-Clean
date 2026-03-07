import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ZodValidationPipe } from "@infra/http/pipes/zod-validation-pipe";
import z from "zod";
import { FetchRecentQuestionsUseCase } from "@domain/forum/application/use-cases/fetch-recent-questions";
import { QuestionPresenter } from "../presenters/question-presenter";

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>;

@Controller("/questions")
@UseGuards(AuthGuard("jwt"))
export class FetchRecentQuestionsController {
  constructor(
    private fetchRecentQuestionsUseCase: FetchRecentQuestionsUseCase,
  ) {}

  @Get()
  async handle(
    @Query("page", new ZodValidationPipe(pageQueryParamsSchema))
    page: PageQueryParamsSchema,
  ) {
    const result = await this.fetchRecentQuestionsUseCase.execute({
      page,
    });

    if(result.isLeft()){
      throw new Error()
    }

    const questions = result.value.questions

    return {
      questions: questions.map(QuestionPresenter.toHttp)
    }
    

  }
}
