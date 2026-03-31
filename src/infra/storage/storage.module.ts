import { Uploader } from "@domain/forum/application/storage/uploader";
import { EnvService } from "@infra/env/env.service";
import { Module } from "@nestjs/common";
import { R2Storage } from "./r2-storage";

@Module({
  providers: [
    EnvService,
    {
      provide: Uploader,
      useClass: R2Storage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
