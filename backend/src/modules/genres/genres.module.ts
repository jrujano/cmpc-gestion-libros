import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { Genre } from './models/genre.model';
import { Book } from '../books/models/book.model';

@Module({
  imports: [SequelizeModule.forFeature([Genre, Book])],
  controllers: [GenresController],
  providers: [GenresService],
  exports: [SequelizeModule, GenresService],
})
export class GenresModule {}
