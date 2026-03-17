import { AppModule } from "@infra/app.module";
import { PrismaService } from "@infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { AnswerFactory } from "test/factory/make-answer";
import { QuestionFactory } from "test/factory/make-question";
import { StudentFactory } from "test/factory/make-student";
import { DatabaseModule } from "@infra/database/database.module";
import request from "supertest";

describe("Edit Answer (E2E)", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let jwt: JwtService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduloRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile();

    app = moduloRef.createNestApplication();
    studentFactory = moduloRef.get(StudentFactory);
    questionFactory = moduloRef.get(QuestionFactory);
    answerFactory = moduloRef.get(AnswerFactory);
    jwt = moduloRef.get(JwtService);
    prisma = moduloRef.get(PrismaService);

    await app.init();
  });

  test("[POST] /answer/:id", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    });

    const answerId = answer.id.toString();

    const response = await request(app.getHttpServer())
      .put(`/answer/${answerId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "New Answer",
      });

    expect(response.statusCode).toBe(204);

    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        content: "New Answer",
        questionId: question.id.toString(),
      },
    });

    expect(answerOnDatabase).toBeTruthy();
  });
});
