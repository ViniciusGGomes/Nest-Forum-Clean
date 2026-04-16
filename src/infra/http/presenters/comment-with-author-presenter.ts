import { CommentWithAuthor } from "@domain/forum/enterprise/entities/value-objects/comment-with-author";

export class CommentWithAuthorPresenter {
  static toHttp(commentWithAutor: CommentWithAuthor) {
    return {
      commentId: commentWithAutor.commentId.toString(),
      authorId: commentWithAutor.authorId.toString(),
      content: commentWithAutor.content,
      authorName: commentWithAutor.author,
      createdAt: commentWithAutor.createdAt,
      updateAt: commentWithAutor.updatedAt,
    };
  }
}
