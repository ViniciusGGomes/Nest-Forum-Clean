import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { AnswerCreatedEvent } from "../../../forum/enterprise/events/answer-created-event";
import { QuestionsRepository } from "../../../forum/application/repositories/questions-repository";
import { SendNotificationUseCase } from "@/domain/notification/application/use-case/send-notification";

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionRepository: QuestionsRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    );
  }

  private async sendAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    );

    if (question) {
      await this.sendNotificationUseCase.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta em ${question.title.substring(0, 40).concat("...")}`,
        content: answer.excerpt,
      });
    }
  }
}
