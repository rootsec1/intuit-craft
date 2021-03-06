import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JobId, Queue } from 'bull';
import { Model } from 'mongoose';
import { ORDERS_QUEUE_NAME } from 'src/constants';
import { OrderInputDto } from './dto/order.input.dto';
import { Order } from './model/order.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private orderModel: Model<Order>,
    @InjectQueue(ORDERS_QUEUE_NAME) private ordersQueue: Queue,
  ) {}

  async createOrder(orderInput: OrderInputDto): Promise<JobId> {
    const job = await this.ordersQueue.add(orderInput);
    console.log('Job created with ID ' + job.id);
    return job.id;
  }
}
