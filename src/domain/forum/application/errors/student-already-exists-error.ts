import { UseCaseError } from "@core/erros/use-case-error";

export class StudentAlreadyExistError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Student ${identifier} already exists`);
  }
}
