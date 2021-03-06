import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProductInputDto } from './dto/create-product.input.dto';
import { UpdateProductInputDto } from './dto/update-product.input.dto';
import { Product } from './model/product.schema';

@Injectable()
export class ProductService {
  constructor(@InjectModel('Product') private productModel: Model<Product>) {}

  async createProduct(
    createProductInputDto: CreateProductInputDto,
  ): Promise<Product> {
    return this.productModel.create(createProductInputDto);
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productModel.find();
  }

  async getProductById(id: Types.ObjectId): Promise<Product> {
    return this.productModel.findById(id);
  }

  async updateProduct(
    id: Types.ObjectId,
    updateProductInputDto: UpdateProductInputDto,
  ): Promise<Product> {
    return this.productModel.findByIdAndUpdate(
      id,
      { $set: updateProductInputDto },
      { new: true },
    );
  }

  async deleteProduct(id: Types.ObjectId): Promise<Product> {
    return this.productModel.findByIdAndRemove(id);
  }
}
