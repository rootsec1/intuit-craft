import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CurrentUserFromJWT } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { HTTPAPIKeyInterceptor } from 'src/interceptors/http-api-key.interceptor';
import { User } from 'src/user/model/user.schema';
import { OrderStatusUpdateDto } from './dto/order-status-update.dto';
import { OrderInputDto } from './dto/order.input.dto';
import { ResponseDTO, Status } from './dto/response.dto';
import { Order } from './model/order.schema';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Body() orderInputDto: OrderInputDto,
    @CurrentUserFromJWT() user: User,
  ): Promise<ResponseDTO> {
    orderInputDto.user = user._id as Types.ObjectId;
    const jobId = await this.orderService.createOrder(orderInputDto);
    if (jobId)
      return new ResponseDTO()
        .setStatus(Status.SUCCESS)
        .setMessage('Order queued');
    else throw new InternalServerErrorException(jobId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getOrdersForUser(@CurrentUserFromJWT() user: User): Promise<Order[]> {
    return this.orderService.getOrdersByUser(user._id);
  }

  @Patch('update-status')
  @UseInterceptors(HTTPAPIKeyInterceptor)
  async updateOrderStatus(
    @Body() orderStatusUpdateDto: OrderStatusUpdateDto,
  ): Promise<Order> {
    return this.orderService.updateOrderStatus(orderStatusUpdateDto);
  }
}
