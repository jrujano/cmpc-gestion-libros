import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book } from './models/book.model';
import { AuthorsModule } from '../authors/authors.module';
import { GenresModule } from '../genres/genres.module';
import { EditorialsModule } from '../editorials/editorials.module';
import { DatabaseModule } from '../shared/database/database.module';
import { CustomerModule } from '../customers/customer.module';
import {  InventoryModule} from "../inventory/inventory.module";

@Module({
  imports: [
    SequelizeModule.forFeature([Book]),
    AuthorsModule,
    GenresModule,
    InventoryModule,
    EditorialsModule,
    DatabaseModule,
    CustomerModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
