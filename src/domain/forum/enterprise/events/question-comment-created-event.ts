import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { QuestionComment } from "../entities/question-comment";

export class QuestionCommentCreatedEvent implements DomainEvent {
  public occurredAt: Date;
  public questionComment: QuestionComment;

  constructor(questionComment: QuestionComment) {
    this.occurredAt = new Date();
    this.questionComment = questionComment;
  }

  public getAggregateId(): UniqueEntityID {
    return this.questionComment.id;
  }
}
