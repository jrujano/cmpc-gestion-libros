import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { Author } from './models/author.model';
import { Book } from '../books/models/book.model';
import { BookAuthor } from '../books/models/book-author.model';

@Module({
  imports: [SequelizeModule.forFeature([Author, Book, BookAuthor])],
  controllers: [AuthorsController],
  providers: [AuthorsService],
  exports: [SequelizeModule, AuthorsService],
})
export class AuthorsModule {}
