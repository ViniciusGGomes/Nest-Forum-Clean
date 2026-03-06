import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { Question } from "../entities/question";

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  public occurredAt: Date;
  public question: Question;
  public bestAnswerId: UniqueEntityID;

  constructor(question: Question, bestAnswerId: UniqueEntityID) {
    this.occurredAt = new Date();
    this.question = question;
    this.bestAnswerId = bestAnswerId;
  }

  public getAggregateId(): UniqueEntityID {
    return this.question.id;
  }
}
