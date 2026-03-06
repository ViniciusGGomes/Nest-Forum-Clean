import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { SendNotificationUseCase } from "./send-notification";
import { beforeEach, describe, expect, it } from "vitest";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe("Send notification", () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
  });

  it("should be able to send a notification", async () => {
    const result = await sut.execute({
      recipientId: "1",
      title: "Nova notificação",
      content: "Conteúdo da notificação",
    });

    expect(result.isRight()).toEqual(true);
    expect(inMemoryNotificationsRepository.items).toHaveLength(1);
    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      result.value?.notification,
    );
  });
});
