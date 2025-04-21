import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryFilterDto } from './dto/inventory-filter.dto';
import { InventoryResponseDto } from './dto/inventory-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

@ApiTags('Inventario')
@ApiBearerAuth('access-token') 
@UseGuards(JwtAuthGuard) 
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new inventory movement' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The movement has been successfully created.',
    type: InventoryResponseDto,
  })
  async create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all inventory movements' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of inventory movements',
    type: [InventoryResponseDto],
  })
  async findAll(@Query() filter: InventoryFilterDto) {
    return this.inventoryService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific inventory movement' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found movement',
    type: InventoryResponseDto,
  })
  async findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an inventory movement' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The movement has been successfully updated.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(+id, updateInventoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an inventory movement' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The movement has been successfully deleted.',
  })
  async delete(@Param('id') id: string) {
    return this.inventoryService.remove(+id);
  }

  @Get('report')
  @ApiOperation({ summary: 'Get inventory report with filters' })
  async getReport(@Query() filter: InventoryFilterDto) {
    return this.inventoryService.getInventoryReport(filter);
  }
}
