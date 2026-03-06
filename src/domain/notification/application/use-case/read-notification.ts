import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/erros/erros/not-allowed-error";
import { ResourceNotFoundError } from "@/core/erros/erros/resource-not-found-error";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationRepository } from "../repositories/notifications-repository";

interface ReadNotificationUseCaseRequest {
  recipientId: string;
  notificationId: string;
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { notification: Notification }
>;

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.notificationsRepository.findById(
      notificationId
    );

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    if (recipientId != notification.recipientId.toString()) {
      return left(new NotAllowedError());
    }

    notification.read();

    await this.notificationsRepository.save(notification);

    return right({
      notification,
    });
  }
}
