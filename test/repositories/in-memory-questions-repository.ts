import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { InMemoryQuestionAttachmentsRepository } from "./in-memory-question-attachments-repository";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";
import { InMemoryAttachmentsRepository } from "./in-memory-attachments-repository";
import { QuestionDetails } from "@domain/forum/enterprise/entities/value-objects/question-details";

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository,
    private inMemoryStudentsRepository: InMemoryStudentsRepository,
    private inMemoryAttachmentsRepository: InMemoryAttachmentsRepository,
  ) {}

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id);

    if (!question) {
      return null;
    }

    return question;
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) {
      return null;
    }

    return question;
  }

  async findDetailsBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) {
      return null;
    }

    const author = this.inMemoryStudentsRepository.items.find((student) => {
      return student.id.equals(question.authorId);
    });

    if (!author) {
      throw new Error(
        `Author with id "${question.authorId.toString}" does not exist`,
      );
    }

    const questionAttachments =
      this.inMemoryQuestionAttachmentRepository.items.filter(
        (questionAttachment) => {
          return questionAttachment.questionId.equals(question.id);
        },
      );

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.inMemoryAttachmentsRepository.items.find(
        (attachment) => {
          return attachment.id.equals(questionAttachment.attachmentId);
        },
      );

      if (!attachment) {
        throw new Error(
          `Attachment with id "${questionAttachment.attachmentId}" does not exist`,
        );
      }

      return attachment;
    });

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      bestAnswerId: question.bestAnswerId,
      title: question.title,
      content: question.content,
      slug: question.slug,
      author: author.name,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    });
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }

  async create(question: Question) {
    this.items.push(question);

    this.inMemoryQuestionAttachmentRepository.createMany(
      question.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.items[itemIndex] = question;

    this.inMemoryQuestionAttachmentRepository.createMany(
      question.attachments.getNewItems(),
    );

    this.inMemoryQuestionAttachmentRepository.deleteMany(
      question.attachments.getRemovedItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.items.splice(itemIndex, 1);

    this.inMemoryQuestionAttachmentRepository.deleteManyByQuestionId(
      question.id.toString(),
    );
  }
}
