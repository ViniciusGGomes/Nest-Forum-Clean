import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";
import { makeQuestion } from "test/factory/make-question";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionaAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: FetchRecentQuestionsUseCase;

describe("Fetch recent questions", () => {
  beforeEach(() => {
    inMemoryQuestionaAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionaAttachmentsRepository,
    );
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to fetch recent questions", async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date("2025-0-10") }),
    );
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date("2025-0-11") }),
    );
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date("2025-0-12") }),
    );

    const result = await sut.execute({
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date("2025-0-12") }),
      expect.objectContaining({ createdAt: new Date("2025-0-11") }),
      expect.objectContaining({ createdAt: new Date("2025-0-10") }),
    ]);
  });

  it("should be able to fetch paginated recent questions", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion());
    }

    const result = await sut.execute({
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.questions).toHaveLength(2);
  });
});
