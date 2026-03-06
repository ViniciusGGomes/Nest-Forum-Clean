import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { QuestionCommentCreatedEvent } from "@/domain/forum/enterprise/events/question-comment-created-event";
import { SendNotificationUseCase } from "../use-case/send-notification";

export class OnQuestionCommentCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }
  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionCommentNotification.bind(this),
      QuestionCommentCreatedEvent.name,
    );
  }

  private async sendQuestionCommentNotification({
    questionComment,
  }: QuestionCommentCreatedEvent) {
    const question = await this.questionsRepository.findById(
      questionComment.questionId.toString(),
    );

    if (question) {
      this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Novo Comentário em ${question.title.substring(0, 40).concat("...")}`,
        content: questionComment.content.substring(0, 20).concat("..."),
      });
    }
  }
}
