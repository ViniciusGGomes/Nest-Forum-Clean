import { Either, left, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { ResourceNotFoundError } from "@/core/erros/erros/resource-not-found-error";
import { NotAllowedError } from "@/core/erros/erros/not-allowed-error";
import { QuestionAttachmentRepository } from "../repositories/question-attachments-repository";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface EditQuestionUseCaseRequest {
  authorId: string;
  title: string;
  content: string;
  questionId: string;
  attachmentsIds: string[];
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { question: Question }
>;

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentRepository
  ) {}

  async execute({
    authorId,
    title,
    content,
    questionId,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId != question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId);

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments
    );

    /*Maneira aprendida em aula, porém não aplica o conceito de watched list */
    // const questionAttachments = attachmentsIds.map((attachmentId) => {
    //   return QuestionAttachment.create({
    //     attachmentId: new UniqueEntityID(attachmentId),
    //     questionId: question.id,
    //   });
    // });

    /*Maneira correta, aplicando o conceito de watched list*/
    const newList = attachmentsIds.map((attachmentId) => {
      const existing = currentQuestionAttachments.find(
        (a) => a.attachmentId.toValue() === attachmentId
      );

      if (existing) return existing; // reaproveita o attachment antigo (com _id antigo)

      return QuestionAttachment.create({
        questionId: question.id,
        attachmentId: new UniqueEntityID(attachmentId),
      });
    });

    questionAttachmentList.update(newList);

    question.title = title;
    question.content = content;
    question.attachments = questionAttachmentList;

    await this.questionsRepository.save(question);

    return right({
      question,
    });
  }
}
