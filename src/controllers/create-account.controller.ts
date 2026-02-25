import { ConflictException, UsePipes } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { hash } from "bcryptjs";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { PrismaService } from "src/prisma/prisma.service";
import z from "zod";

const createdAccountBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

type CreatedAccountBodySchema = z.infer<typeof createdAccountBodySchema>;

@Controller("/accounts")
export class CreateAccountController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createdAccountBodySchema))
  async handle(@Body() body: CreatedAccountBodySchema) {
    const { name, email, password } = body;

    const userWithSameEmail = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new ConflictException("User with same e-mail already exists");
    }

    const hashedPassword = await hash(password, 8);

    await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }
}
