import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { AnswerCommentCreatedEvent } from "@/domain/forum/enterprise/events/answer-comment-created-event";
import { SendNotificationUseCase } from "../use-case/send-notification";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";

export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendAnswerCommentNotification.bind(this),
      AnswerCommentCreatedEvent.name,
    );
  }

  private async sendAnswerCommentNotification({
    answerComment,
  }: AnswerCommentCreatedEvent) {
    const answer = await this.answersRepository.findById(
      answerComment.answerId.toString(),
    );

    if (answer) {
      const question = await this.questionsRepository.findById(
        answer.questionId.toString(),
      );

      this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Novo Comentário de resposta em ${question?.title.substring(0, 40).concat("...")}`,
        content: answerComment.content.substring(0, 20).concat("..."),
      });
    }
  }
}
