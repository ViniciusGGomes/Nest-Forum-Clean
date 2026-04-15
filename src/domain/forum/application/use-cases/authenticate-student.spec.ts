import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { AuthenticateStudentUseCase } from "./authenticate-student";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { makeStudent } from "test/factory/make-student";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateStudentUseCase;

describe("Authenticate Student", () => {
  beforeAll(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it("Should be able to authenticate a student", async () => {
    const student = makeStudent({
      email: "johndoe@gmail.com",
      password: await fakeHasher.hash("123456"),
    });

    // console.log(student.name, student.email, student.password);

    inMemoryStudentsRepository.items.push(student);

    const result = await sut.execute({
      email: "johndoe@gmail.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
