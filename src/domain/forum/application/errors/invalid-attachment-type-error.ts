import { UseCaseError } from "@core/erros/use-case-error";

export class InvalidAttachmentTypeError extends Error implements UseCaseError {
  constructor(type: string) {
    super(`File type "${type}" is not valid`);
  }
}
