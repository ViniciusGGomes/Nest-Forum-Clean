import { QuestionDetails } from "@domain/forum/enterprise/entities/value-objects/question-details";
import { AttachmentPresenter } from "./attachment-presenter";

export class QuestionDetailsPresenter {
  static toHttp(questionDetails: QuestionDetails) {
    return {
      questionId: questionDetails.questionId.toString(),
      title: questionDetails.title,
      content: questionDetails.content,
      slug: questionDetails.slug,
      bestAnswerId: questionDetails.bestAnswerId?.toString(),
      authorId: questionDetails.authorId.toString(),
      authorName: questionDetails.author,
      attachments: questionDetails.attachments.map(AttachmentPresenter.toHttp),
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
    };
  }
}
