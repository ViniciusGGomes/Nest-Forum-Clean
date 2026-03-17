import { Either, left, right } from "@/core/either";
import { QuestionCommentsRepository } from "../repositories/question-comments-repository";
import { NotAllowedError } from "@/core/erros/erros/not-allowed-error";
import { ResourceNotFoundError } from "@/core/erros/erros/resource-not-found-error";
import { Injectable } from "@nestjs/common";

interface DeleteQuestionCommentUseCaseRequest {
  questionCommentId: string;
  authorId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;
@Injectable()
export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionCommentId,
    authorId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId);

    if (!questionComment) {
      return left(new ResourceNotFoundError());
    }

    if (authorId != questionComment.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.questionCommentsRepository.delete(questionComment);

    return right(null);
  }
}
