import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Model, Types } from 'mongoose';
import { Order } from 'src/order/model/order.schema';
import { CreateUserInputDto } from './dto/create-user.input.dto';
import { UpdateUserInputDto } from './dto/update-user.input.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './model/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async createUser(
    createUserInputDto: CreateUserInputDto,
  ): Promise<UserResponseDto> {
    const exists = await this.doesUserWithEmailExist(createUserInputDto.email);
    if (exists) throw new BadRequestException('User with email already exists');
    createUserInputDto.password = await hash(createUserInputDto.password, 12);
    const newUser = await this.userModel.create(createUserInputDto);
    return new UserResponseDto(newUser);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find();
  }

  async getUserById(id: Types.ObjectId): Promise<User> {
    return this.userModel.findById(id);
  }

  async updateUser(
    id: Types.ObjectId,
    updateUserInputDto: UpdateUserInputDto,
  ): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      id,
      { $set: updateUserInputDto },
      { new: true },
    );
  }

  async deleteUser(id: Types.ObjectId): Promise<User> {
    return this.userModel.findByIdAndRemove(id);
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async doesUserWithEmailExist(email: string): Promise<boolean> {
    return this.userModel.exists({ email });
  }

  async addOrderToUser(order: Order): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      order.user,
      {
        $addToSet: {
          orders: order._id,
        },
      },
      {
        new: true,
      },
    );
  }
}
