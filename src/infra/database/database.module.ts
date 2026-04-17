import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";

import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prisma-question-comments-repository";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prisma-question-attachments-repository";
import { PrismaAnswersRepository } from "./prisma/repositories/prisma-answers-repository";

import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prisma-answer-attachments-repository";
import { QuestionsRepository } from "@domain/forum/application/repositories/questions-repository";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { StudentsRepository } from "@domain/forum/application/repositories/students-repository";
import { PrismaStudentsRepository } from "./prisma/repositories/prisma-students-repository";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prisma-answer-comments-repository";
import { QuestionCommentsRepository } from "@domain/forum/application/repositories/question-comments-repository";
import { QuestionAttachmentsRepository } from "@domain/forum/application/repositories/question-attachments-repository";
import { AnswersRepository } from "@domain/forum/application/repositories/answers-repository";
import { AnswerAttachmentsRepository } from "@domain/forum/application/repositories/answer-attachments-repository";
import { AnswerCommentsRepository } from "@domain/forum/application/repositories/answer-comments-repository";
import { AttachmentsRepository } from "@domain/forum/application/repositories/attachments-repository";
import { PrismaAttachmentsRepository } from "./prisma/repositories/prisma-attachments-repository";
import { NotificationRepository } from "@domain/notification/application/repositories/notifications-repository";
import { PrismaNotificationsRepository } from "./prisma/repositories/prisma-notifications-repository";
import { CacheModule } from "@infra/cache/cache.module";

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },

    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: AnswersRepository,
      useClass: PrismaAnswersRepository,
    },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: NotificationRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    StudentsRepository,
    QuestionsRepository,
    QuestionCommentsRepository,
    QuestionAttachmentsRepository,
    AnswersRepository,
    AnswerCommentsRepository,
    AnswerAttachmentsRepository,
    AttachmentsRepository,
    NotificationRepository,
  ],
})
export class DatabaseModule {}
