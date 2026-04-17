import { AppModule } from "@infra/app.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { QuestionFactory } from "test/factory/make-question";
import { StudentFactory } from "test/factory/make-student";
import request from "supertest";
import { DatabaseModule } from "@infra/database/database.module";
import { PrismaService } from "@infra/database/prisma/prisma.service";
import { waitFor } from "test/utils/wait-for";
import { DomainEvents } from "@core/events/domain-events";

describe("On Answer Question (E2E)", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let jwt: JwtService;
  let prisma: PrismaService;

  beforeAll(async () => {
    DomainEvents.shouldRun = true;

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  it("should send a notification when answer is created", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const questionId = question.id.toString();

    await request(app.getHttpServer())
      .post(`/questions/${questionId}/answer`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "new answer",
        attachments: [],
      });

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
