import { GetQuestionBySlugUseCase } from "@domain/forum/application/use-cases/get-question-by-slug";
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from "@nestjs/common";
import { ResourceNotFoundError } from "@core/erros/erros/resource-not-found-error";
import { QuestionDetailsPresenter } from "../presenters/question-details-presenter";

@Controller("/questions/:slug")
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlugUseCase: GetQuestionBySlugUseCase) {}

  @Get()
  async handle(@Param("slug") slug: string) {
    const result = await this.getQuestionBySlugUseCase.execute({
      slug,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const question = QuestionDetailsPresenter.toHttp(result.value.question);

    return {
      question,
    };
  }
}
