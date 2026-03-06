import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { AnswerComment } from "../entities/answer-comment";

export class AnswerCommentCreatedEvent implements DomainEvent {
  public occurredAt: Date;
  public answerComment: AnswerComment;

  constructor(answerComment: AnswerComment) {
    this.occurredAt = new Date();
    this.answerComment = answerComment;
  }

  public getAggregateId(): UniqueEntityID {
    return this.answerComment.id;
  }
}
