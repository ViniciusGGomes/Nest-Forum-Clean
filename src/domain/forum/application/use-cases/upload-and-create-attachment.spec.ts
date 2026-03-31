import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { UploadAndCreateAttachmentUseCase } from "./upload-and-create-attachment";
import { FakerUploader } from "test/storage/faker-uploader";
import { InvalidAttachmentTypeError } from "../errors/invalid-attachment-type-error";

let fakerUploader: FakerUploader;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let sut: UploadAndCreateAttachmentUseCase;

describe("Upload and create attachment", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    fakerUploader = new FakerUploader();
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakerUploader,
    );
  });

  it("should be able to upload and create an attachment", async () => {
    const result = await sut.execute({
      fileName: "profile.png",
      fileType: "application/pdf",
      body: Buffer.from(""),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    });
    expect(fakerUploader.uploads).toHaveLength(1);
    expect(fakerUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: "profile.png",
      }),
    );
  });

  it("should not be able to upload an attachment with invalid file type", async () => {
    const result = await sut.execute({
      fileName: "profile.mp3",
      fileType: "image/mpeg",
      body: Buffer.from(""),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(InvalidAttachmentTypeError);
  });
});
