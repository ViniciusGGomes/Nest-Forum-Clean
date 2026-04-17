import { AppModule } from "@infra/app.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { QuestionFactory } from "test/factory/make-question";
import { StudentFactory } from "test/factory/make-student";
import request from "supertest";
import { DatabaseModule } from "@infra/database/database.module";
import { AnswerFactory } from "test/factory/make-answer";
import { PrismaService } from "@infra/database/prisma/prisma.service";
import { waitFor } from "test/utils/wait-for";
import { DomainEvents } from "@core/events/domain-events";

describe("On Question Best Answer Chosen (E2E)", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let jwt: JwtService;
  let prisma: PrismaService;

  beforeAll(async () => {
    DomainEvents.shouldRun = true
    
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  it("should send a notification when question best answer is chosen", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
      content: "Answer 01",
    });

    const answerId = answer.id.toString();

    await request(app.getHttpServer())
      .patch(`/answers/${answerId}/choose-as-best`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: user.id.toString(),
        },
      });

      expect(notificationOnDatabase).not.toBeNull();
    });
  });
});
