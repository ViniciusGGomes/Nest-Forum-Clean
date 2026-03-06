import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { EditAnswerUseCase } from "./edit-answer";
import { makeAnswer } from "test/factory/make-answer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/erros/erros/not-allowed-error";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { makeAnswerAttachment } from "test/factory/make-answer-attachment";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: EditAnswerUseCase;

describe("Edit answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository,
    );
  });

  it("should be able to edit an answer", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("question-id"),
    );

    await inMemoryAnswersRepository.create(newAnswer);

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment(
        {
          answerId: newAnswer.id,
          attachmentId: new UniqueEntityID("1"),
        },
        new UniqueEntityID("Attachment-1"),
      ),
      makeAnswerAttachment(
        {
          answerId: newAnswer.id,
          attachmentId: new UniqueEntityID("2"),
        },
        new UniqueEntityID("Attachment-2"),
      ),
    );

    await sut.execute({
      authorId: "author-1",
      answerId: newAnswer.id.toValue(),
      content: "Resposta editada",
      attachmentsIds: ["1", "3"],
    });

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: "Resposta editada",
    });
    expect(
      inMemoryAnswersRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
        expect.objectContaining({ attachmentId: new UniqueEntityID("3") }),
      ],
    );

    // /*Itens atuais, adicionados, removidos */
    // const answer = inMemoryAnswersRepository.items[0];

    // console.log("CURRENT ITENS", answer.attachments.getItems());
    // console.log("ADDED", answer.attachments.getNewItems());
    // console.log("REMOVED", answer.attachments.getRemovedItems());
  });

  it("should not be able to edit an answer from another person", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("question-id"),
    );

    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      authorId: "author-2",
      answerId: newAnswer.id.toValue(),
      content: "Resposta editada",
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
