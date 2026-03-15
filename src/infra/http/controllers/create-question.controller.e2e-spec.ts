import { AppModule } from "@/infra/app.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { PrismaService } from "@infra/database/prisma/prisma.service";
import request from "supertest";
import { StudentFactory } from "test/factory/make-student";
import { DatabaseModule } from "@infra/database/database.module";

describe("Create Question (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[POST] /questions", async () => {
    const user = await studentFactory.makePrismaStudent({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post("/questions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "New question",
        content: "Question content",
      });

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: "New question",
      },
    });

    expect(response.statusCode).toBe(201);
    expect(questionOnDatabase).toBeTruthy();
  });
});
