import { AppModule } from "@/infra/app.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { PrismaService } from "@infra/database/prisma/prisma.service";
import request from "supertest";
import { StudentFactory } from "test/factory/make-student";
import { DatabaseModule } from "@infra/database/database.module";
import { QuestionFactory } from "test/factory/make-question";
import { DomainEvents } from "@core/events/domain-events";
import { waitFor } from "test/utils/wait-for";

describe("On Question Comment Created (E2E)", () => {
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
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  it("should send a notification when question comment is created", async () => {
    const user = await studentFactory.makePrismaStudent({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const questionId = question.id.toString();

    await request(app.getHttpServer())
      .post(`/questions/${questionId}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "New Comment",
      });

    await waitFor(async () => {
      const notificationOnDatabase = prisma.notification.findFirst({
        where: {
          recipientId: user.id.toString(),
        },
      });

      expect(notificationOnDatabase).not.toBeNull();
    });
  });
});
