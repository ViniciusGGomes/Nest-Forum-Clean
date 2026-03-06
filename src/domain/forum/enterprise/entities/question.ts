import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Slug } from "./value-objects/slug";
import { Optional } from "@/core/types/optional";
import dayjs from "dayjs";
import { AggregateRoot } from "@/core/entities/aggregate-root";
import { QuestionAttachmentList } from "./question-attachment-list";
import { QuestionBestAnswerChosenEvent } from "../events/question-best-answer-chosen-event";

export interface QuestionProps {
  title: string;
  slug: Slug;
  content: string;
  attachments: QuestionAttachmentList;
  authorId: UniqueEntityID;
  bestAnswerId?: UniqueEntityID | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Question extends AggregateRoot<QuestionProps> {
  get title() {
    return this.props.title;
  }

  set title(title: string) {
    this.props.title = title;
    this.props.slug = Slug.createFromText(this.props.title);
    this.touch();
  }

  get slug() {
    return this.props.slug;
  }

  get content() {
    return this.props.content;
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  get attachments() {
    return this.props.attachments;
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments;
    this.touch();
  }

  get authorId() {
    return this.props.authorId;
  }

  get bestAnswerId() {
    return this.props.bestAnswerId;
  }

    set bestAnswerId(bestAnswerId: UniqueEntityID | undefined | null) {
    if (bestAnswerId && bestAnswerId != this.props.bestAnswerId) {
      this.addDomainEvent(
        new QuestionBestAnswerChosenEvent(this, bestAnswerId),
      );
    }

    this.props.bestAnswerId = bestAnswerId;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get dayjs() {
    return dayjs().diff(this.createdAt, "days") <= 3;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }



  static create(
    props: Optional<QuestionProps, "createdAt" | "slug" | "attachments">,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return question;
  }
}
