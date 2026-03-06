import { Either, left, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";
import { ResourceNotFoundError } from "@/core/erros/erros/resource-not-found-error";
import { NotAllowedError } from "@/core/erros/erros/not-allowed-error";
import { AnswerAttachmentsRepository } from "../repositories/answer-attachments-repository";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface EditAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
  content: string;
  attachmentsIds: string[];
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { answer: Answer }
>;

export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository
  ) {}

  async execute({
    answerId,
    authorId,
    content,
    attachmentsIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId != answer.authorId.toString()) {
      return left(new NotAllowedError());
    }

    const currentAnswerAttachment =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId);

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachment
    );

    /*Maneira aprendida em aula, porém não aplica o conceito de watched list */
    // const answerAttachment = attachmentsIds.map((attachmentId) => {
    //   return AnswerAttachment.create({
    //     answerId: answer.id,
    //     attachmentId: new UniqueEntityID(attachmentId)
    //   })
    // })

    /*Maneira correta, aplicando o conceito de watched list*/
    const newList = attachmentsIds.map((attachmentId) => {
      const existing = currentAnswerAttachment.find(
        (a) => a.attachmentId.toValue() === attachmentId
      );

      if (existing) return existing; // reaproveita o attachment antigo (com _id antigo)

      return AnswerAttachment.create({
        answerId: answer.id,
        attachmentId: new UniqueEntityID(attachmentId),
      });
    });

    answerAttachmentList.update(newList);

    answer.content = content;
    answer.attachments = answerAttachmentList;

    await this.answersRepository.save(answer);

    return right({
      answer,
    });
  }
}
