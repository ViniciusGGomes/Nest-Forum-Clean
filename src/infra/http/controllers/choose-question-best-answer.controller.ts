import { ChooseQuestionBestAnswerUseCase } from "@domain/forum/application/use-cases/choose-question-best-answer";
import { CurrentUser } from "@infra/auth/current-user-decorator";
import type { UserPayload } from "@infra/auth/jwt.strategy";
import { BadRequestException, Controller, Param, Patch } from "@nestjs/common";

@Controller("/answers/:answerId/choose-as-best")
export class ChooseQuestionBestAnswerController {
  constructor(
    private chooseQuestionBestAnswerUseCase: ChooseQuestionBestAnswerUseCase,
  ) {}

  @Patch()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param("answerId") answerId: string,
  ) {
    const userId = user.sub;

    const result = await this.chooseQuestionBestAnswerUseCase.execute({
      authorId: userId,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
