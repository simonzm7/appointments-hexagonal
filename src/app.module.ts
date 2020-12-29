import { Module } from '@nestjs/common';
import { InfraestructureModel } from './infraestructure/infra.module';
@Module({
  imports: [InfraestructureModel]
})
export class AppModule { }
