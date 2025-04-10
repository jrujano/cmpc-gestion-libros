import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Genre } from './models/genre.model';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(
    @InjectModel(Genre)
    private readonly genreModel: typeof Genre,
  ) {}

  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    return this.genreModel.create({ ...createGenreDto });
  }

  async findAll(): Promise<Genre[]> {
    return this.genreModel.findAll();
  }

  async findOne(id: number): Promise<Genre> {
    return this.genreModel.findByPk(id, {
      include: ['books'],
    });
  }

  async update(id: number, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    const genre = await this.genreModel.findByPk(id);
    return genre.update(updateGenreDto);
  }

  async remove(id: number): Promise<void> {
    const genre = await this.genreModel.findByPk(id);
    await genre.destroy();
  }
}
