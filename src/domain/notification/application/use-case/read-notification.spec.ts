import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { ReadNotificationUseCase } from "./read-notification";
import { beforeEach, describe, expect, it } from "vitest";
import { makeNotification } from "test/factory/make-notification";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/erros/erros/not-allowed-error";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;

describe("Read notification", () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
  });

  it("should be able to read a notification", async () => {
    const newNotification = makeNotification(
      {
        recipientId: new UniqueEntityID("recipient-1"),
      },
      new UniqueEntityID("notification-1"),
    );

    inMemoryNotificationsRepository.items.push(newNotification);

    const result = await sut.execute({
      recipientId: newNotification.recipientId.toString(),
      notificationId: newNotification.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
      expect.any(Date),
    );
  });

  it("should not be able to read a notification from another person", async () => {
    const newNotification = makeNotification(
      {
        recipientId: new UniqueEntityID("recipient-1"),
      },
      new UniqueEntityID("notification-1"),
    );

    inMemoryNotificationsRepository.items.push(newNotification);

    const result = await sut.execute({
      recipientId: "recipient-2",
      notificationId: newNotification.id.toString(),
    });

    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
