import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "@auth/current-user-decorator";
import type { UserPayload } from "@auth/jwt.strategy";
import { ZodValidationPipe } from "@pipes/zod-validation-pipe";
import { PrismaService } from "@prisma/prisma.service";
import z from "zod";

const createQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionSchema = z.infer<typeof createQuestionSchema>;

@Controller("/questions")
@UseGuards(AuthGuard("jwt"))
export class CreateQuestionController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createQuestionSchema))
    body: CreateQuestionSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body;
    const userId = user.sub;

    const slug = this.convertToSlug(title);

    const question = await this.prismaService.question.create({
      data: {
        authorId: userId,
        title,
        content,
        Slug: slug,
      },
    });

    return {
      question,
    };
  }

  convertToSlug(title) {
    return title
      .toLowerCase()
      .normalize("NFD") // remove acentos
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "") // remove caracteres especiais
      .trim()
      .replace(/\s+/g, "-") // espaço -> hífen
      .replace(/-+/g, "-"); // evita hífen duplicado
  }
}
