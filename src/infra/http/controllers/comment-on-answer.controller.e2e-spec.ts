import { AppModule } from "@/infra/app.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { PrismaService } from "@infra/database/prisma/prisma.service";
import request from "supertest";
import { StudentFactory } from "test/factory/make-student";
import { DatabaseModule } from "@infra/database/database.module";
import { QuestionFactory } from "test/factory/make-question";
import { AnswerFactory } from "test/factory/make-answer";

describe("Comment On Answer (E2E)", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let jwt: JwtService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test("[POST] /answers/:answerId/comments", async () => {
    const user = await studentFactory.makePrismaStudent({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    });

    const answerId = answer.id.toString();

    const response = await request(app.getHttpServer())
      .post(`/answers/${answerId}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "New Answer",
      });

    expect(response.statusCode).toBe(201);

    const questionCommentOnDatabase = await prisma.comment.findFirst({
      where: {
        answerId,
      },
    });

    expect(questionCommentOnDatabase).toBeTruthy();
  });
});
