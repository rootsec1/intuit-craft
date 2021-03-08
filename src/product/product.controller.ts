import {
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { HTTPAPIKeyInterceptor } from 'src/interceptors/http-api-key.interceptor';
import { CreateProductInputDto } from './dto/create-product.input.dto';
import { UpdateProductInputDto } from './dto/update-product.input.dto';
import { Product } from './model/product.schema';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('create')
  @UseInterceptors(HTTPAPIKeyInterceptor)
  async createProduct(
    @Body() createProductInputDto: CreateProductInputDto,
  ): Promise<Product> {
    return this.productService.createProduct(createProductInputDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CacheInterceptor)
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CacheInterceptor)
  async getProduct(@Param('id') id: string): Promise<Product> {
    return this.productService.getProductById(Types.ObjectId(id));
  }

  @Get(':id/price')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CacheInterceptor)
  async getPriceForProduct(@Param('id') id: string): Promise<number> {
    return this.productService.getPriceForProduct(Types.ObjectId(id));
  }

  @Patch('update')
  @UseInterceptors(HTTPAPIKeyInterceptor)
  async updateProduct(
    @Body() updateProductInputDto: UpdateProductInputDto,
    @Query('id') id: string,
  ): Promise<Product> {
    return this.productService.updateProduct(
      Types.ObjectId(id),
      updateProductInputDto,
    );
  }

  @Delete(':id')
  @UseInterceptors(HTTPAPIKeyInterceptor)
  async deleteProduct(@Param('id') id: string): Promise<Product> {
    return this.productService.deleteProduct(Types.ObjectId(id));
  }
}
