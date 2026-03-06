import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { EditQuestionUseCase } from "./edit-question";
import { makeQuestion } from "test/factory/make-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/erros/erros/not-allowed-error";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { makeQuestionAttachment } from "test/factory/make-question-attachment";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionaAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: EditQuestionUseCase;

describe("Edit Question", () => {
  beforeEach(() => {
    inMemoryQuestionaAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionaAttachmentsRepository,
    );
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionaAttachmentsRepository,
    );
  });

  it("should be able to edit a question", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("question-1"),
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    inMemoryQuestionaAttachmentsRepository.items.push(
      makeQuestionAttachment(
        {
          questionId: newQuestion.id,
          attachmentId: new UniqueEntityID("1"),
        },
        new UniqueEntityID("UniqueEntityID-1"),
      ),
      makeQuestionAttachment(
        {
          questionId: newQuestion.id,
          attachmentId: new UniqueEntityID("2"),
        },
        new UniqueEntityID("UniqueEntityID-2"),
      ),
    );

    await sut.execute({
      content: "Texto Editado",
      title: "Titulo editado",
      authorId: "author-1",
      questionId: newQuestion.id.toValue(),
      attachmentsIds: ["1", "3"],
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      content: "Texto Editado",
      title: "Titulo editado",
    });
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityID("3") }),
    ]);

    // /*Itens atuais, adicionados, removidos */
    // const question = inMemoryQuestionsRepository.items[0];

    // // Quais foram mantidos (estado final)
    // console.log("CURRENT:", question.attachments.getItems());

    // // Quais foram adicionados
    // console.log("ADDED:", question.attachments.getNewItems());

    // // Quais foram removidos
    // console.log("REMOVED:", question.attachments.getRemovedItems());
  });
  it("should not be able to edit a question from another person", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("question-1"),
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      content: "Texto Editado",
      title: "Titulo editado",
      authorId: "author-2",
      questionId: newQuestion.id.toValue(),
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
