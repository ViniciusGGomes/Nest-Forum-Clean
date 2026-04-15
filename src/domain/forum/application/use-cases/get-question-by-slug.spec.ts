import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { makeQuestion } from "test/factory/make-question";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { makeStudent } from "test/factory/make-student";
import { makeAttachment } from "test/factory/make-attachment";
import { makeQuestionAttachment } from "test/factory/make-question-attachment";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionaAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: GetQuestionBySlugUseCase;

describe("Get Question By Slug", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();

    inMemoryQuestionaAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionaAttachmentsRepository,
      inMemoryStudentsRepository,
      inMemoryAttachmentsRepository,
    );
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to get a question by slug", async () => {
    const student = makeStudent({ name: "John doe" });

    inMemoryStudentsRepository.items.push(student);

    const newQuestion = makeQuestion({
      authorId: student.id,
      slug: Slug.create("example-question"),
    });

    inMemoryQuestionsRepository.create(newQuestion);

    const attachment = makeAttachment({
      title: "Some attachment",
    });

    inMemoryAttachmentsRepository.items.push(attachment);

    inMemoryQuestionaAttachmentsRepository.items.push(
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: newQuestion.id,
      }),
    );

    const result = await sut.execute({
      slug: "example-question",
    });

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
        author: "John doe",
        attachments: [
          expect.objectContaining({
            title: "Some attachment",
          }),
        ],
      }),
    });
  });
});
