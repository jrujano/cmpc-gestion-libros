import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EditorialsService } from './editorials.service';
import { CreateEditorialDto } from './dto/create-editorial.dto';
import { UpdateEditorialDto } from './dto/update-editorial.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

@ApiTags('editorials')
@ApiBearerAuth('access-token') // Vinculamos con el esquema configurado en Swagger
@UseGuards(JwtAuthGuard) // Protegemos los endpoints con el guard de JWT
@Controller('editorials')
export class EditorialsController {
  constructor(private readonly editorialsService: EditorialsService) {}

  @Post()
  create(@Body() createEditorialDto: CreateEditorialDto) {
    return this.editorialsService.create(createEditorialDto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.editorialsService.findAll(page, limit, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.editorialsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateEditorialDto: UpdateEditorialDto,
  ) {
    return this.editorialsService.update(+id, updateEditorialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.editorialsService.remove(+id);
  }
}
