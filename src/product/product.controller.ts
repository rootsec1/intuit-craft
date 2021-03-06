import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Types } from 'mongoose';
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
  @UseInterceptors(HTTPAPIKeyInterceptor)
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  @UseInterceptors(HTTPAPIKeyInterceptor)
  async getProduct(@Param('id') id: string): Promise<Product> {
    return this.productService.getProductById(Types.ObjectId(id));
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
