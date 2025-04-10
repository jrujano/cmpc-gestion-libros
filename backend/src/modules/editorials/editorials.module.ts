import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EditorialsService } from './editorials.service';
import { EditorialsController } from './editorials.controller';
import { Editorial } from './models/editorial.model';
import { Book } from '../books/models/book.model';

@Module({
  imports: [SequelizeModule.forFeature([Editorial, Book])],
  controllers: [EditorialsController],
  providers: [EditorialsService],
  exports: [SequelizeModule, EditorialsService],
})
export class EditorialsModule {}
