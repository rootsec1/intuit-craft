import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CurrentUserFromJWT } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { User } from 'src/user/model/user.schema';
import { OrderInputDto } from './dto/order.input.dto';
import { ResponseDTO, Status } from './dto/response.dto';
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

  async getAllOrders(
    @Body() orderInputDto: OrderInputDto,
  ): Promise<ResponseDTO> {
    const jobId = await this.orderService.createOrder(orderInputDto);
    if (jobId)
      return new ResponseDTO()
        .setStatus(Status.SUCCESS)
        .setMessage(jobId.toString());
    else throw new InternalServerErrorException(jobId);
  }
}
