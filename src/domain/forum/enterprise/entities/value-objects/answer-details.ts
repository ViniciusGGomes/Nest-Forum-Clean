import { UniqueEntityID } from "@core/entities/unique-entity-id";
import { ValueObject } from "@core/entities/value-object";
import { Attachment } from "../attachment";

export interface AnswerDetailsProps {
  questionId: UniqueEntityID;
  answerId: UniqueEntityID;
  content: string;
  authorId: UniqueEntityID;
  author: string;
  attachments: Attachment[];
  createdAt: Date;
  updatedAt?: Date | null;
}

export class AnswerDetails extends ValueObject<AnswerDetailsProps> {
  get questionId() {
    return this.props.questionId;
  }

  get answerId() {
    return this.props.answerId;
  }

  get content() {
    return this.props.content;
  }

  get authorId() {
    return this.props.authorId;
  }

  get author() {
    return this.props.author;
  }

  get attachments() {
    return this.props.attachments;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: AnswerDetailsProps) {
    return new AnswerDetails(props);
  }
}
