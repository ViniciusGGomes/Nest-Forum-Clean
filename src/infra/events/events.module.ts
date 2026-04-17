import { OnAnswerCommentCreated } from "@domain/notification/application/subscribers/on-answer-comment-created";
import { OnAnswerCreated } from "@domain/notification/application/subscribers/on-answer-created";
import { OnQuestionBestAnswerChosen } from "@domain/notification/application/subscribers/on-question-best-answer-chosen";
import { OnQuestionCommentCreated } from "@domain/notification/application/subscribers/on-question-comment-created";
import { SendNotificationUseCase } from "@domain/notification/application/use-case/send-notification";
import { DatabaseModule } from "@infra/database/database.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [DatabaseModule],
  providers: [
    OnAnswerCommentCreated,
    OnQuestionCommentCreated,
    OnAnswerCreated,
    OnQuestionBestAnswerChosen,
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
