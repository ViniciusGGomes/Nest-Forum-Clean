import { AppModule } from "@infra/app.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { StudentFactory } from "test/factory/make-student";
import request from "supertest";
import { DatabaseModule } from "@infra/database/database.module";
import { QuestionFactory } from "test/factory/make-question";
import { QuestionCommentFactory } from "test/factory/make-question-comment";

describe("Fetch Question Comments (E2E)", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let questionCommentFactory: QuestionCommentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    questionCommentFactory = moduleRef.get(QuestionCommentFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /questions/:questionId/comments", async () => {
    const user = await studentFactory.makePrismaStudent({
      name: "John doe",
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const questionId = question.id.toString();

    await Promise.all([
      questionCommentFactory.makePrismaQuestionComment({
        questionId: question.id,
        authorId: user.id,
        content: "Content 01",
      }),
      questionCommentFactory.makePrismaQuestionComment({
        questionId: question.id,
        authorId: user.id,
        content: "Content 02",
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({
          content: "Content 01",
          authorName: "John doe",
        }),
        expect.objectContaining({
          content: "Content 02",
          authorName: "John doe",
        }),
      ]),
    });
  });
});
