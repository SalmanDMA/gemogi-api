import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { QueryProductDto } from './dto/query-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../users/entities/role.enum';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  @ApiCreatedResponse({ description: 'Product successfully created.' })
  @ApiBadRequestResponse({
    description: 'Validation failed or invalid input data.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access token.' })
  @ApiForbiddenResponse({ description: 'Forbidden. Admin role required.' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a product (Admin only)' })
  @ApiParam({ name: 'id', description: 'Product UUID', format: 'uuid' })
  @ApiOkResponse({ description: 'Product successfully updated.' })
  @ApiBadRequestResponse({ description: 'Validation failed or invalid UUID.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access token.' })
  @ApiForbiddenResponse({ description: 'Forbidden. Admin role required.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary:
      'Get paginated product list with optional search & category filter',
  })
  @ApiOkResponse({
    description: 'Paginated product list retrieved successfully.',
  })
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get product detail by ID' })
  @ApiParam({ name: 'id', description: 'Product UUID', format: 'uuid' })
  @ApiOkResponse({ description: 'Product detail retrieved successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid UUID format.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Public()
  @Post('contact')
  @ApiOperation({ summary: 'Submit a contact form message' })
  @ApiOkResponse({ description: 'Contact form message received successfully.' })
  submitContact() {
    return {
      success: true,
      message: 'Pesan Anda berhasil dikirim!',
    };
  }
}
