import { Either, left, right } from "@/core/either";
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository";
import { ResourceNotFoundError } from "@/core/erros/erros/resource-not-found-error";
import { NotAllowedError } from "@/core/erros/erros/not-allowed-error";
import { Injectable } from "@nestjs/common";

interface DeleteAnswerCommentUseCaseRequest {
  answerCommentId: string;
  authorId: string;
}

type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerCommentId,
    authorId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId);

    if (!answerComment) {
      return left(new ResourceNotFoundError());
    }

    if (authorId != answerComment.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.answerCommentsRepository.delete(answerComment);

    return right(null);
  }
}
