import { UniqueEntityID } from "@core/entities/unique-entity-id";
import { ValueObject } from "@core/entities/value-object";
import { Attachment } from "../attachment";
import { Slug } from "./slug";

export interface QuestionDetailsProps {
  questionId: UniqueEntityID;
  title: string;
  content: string;
  slug: Slug;
  bestAnswerId?: UniqueEntityID | null;
  authorId: UniqueEntityID;
  author: string;
  attachments: Attachment[];
  createdAt: Date;
  updatedAt?: Date | null;
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  get questionId() {
    return this.props.questionId;
  }

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get slug() {
    return this.props.slug;
  }

  get bestAnswerId() {
    return this.props.bestAnswerId;
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

  static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props);
  }
}
