import {
  BadRequestException,
  ConflictException,
  UsePipes,
} from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ZodValidationPipe } from "@infra/http/pipes/zod-validation-pipe";
import z from "zod";
import { RegisterStudentUseCase } from "@domain/forum/application/use-cases/register-student";
import { StudentAlreadyExistError } from "@domain/forum/application/errors/student-already-exists-error";
import { Public } from "@infra/auth/public";

const createdAccountBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

type CreatedAccountBodySchema = z.infer<typeof createdAccountBodySchema>;

@Controller("/accounts")
@Public()
export class CreateAccountController {
  constructor(private registerStudentUseCase: RegisterStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createdAccountBodySchema))
  async handle(@Body() body: CreatedAccountBodySchema) {
    const { name, email, password } = body;

    const result = await this.registerStudentUseCase.execute({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case StudentAlreadyExistError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
