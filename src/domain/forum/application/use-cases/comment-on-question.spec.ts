import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { CommentOnQuestionUseCase } from "./comment-on-question";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factory/make-question";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionaAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: CommentOnQuestionUseCase;

describe("Comment on question", () => {
  beforeEach(() => {
    inMemoryQuestionaAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionaAttachmentsRepository,
    );
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    );
  });

  it("should be able to comment on question", async () => {
    const question = makeQuestion();

    await inMemoryQuestionsRepository.create(question);

    await sut.execute({
      authorId: question.authorId.toString(),
      questionId: question.id.toString(),
      content: "Comentário teste",
    });

    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
      "Comentário teste",
    );
  });
});
