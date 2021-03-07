import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobId, Queue } from 'bull';
import { Model, Types } from 'mongoose';
import { ORDERS_QUEUE_NAME } from 'src/constants';
import { UserService } from 'src/user/user.service';
import { OrderInputDto } from './dto/order.input.dto';
import { Order } from './model/order.schema';

@Injectable()
@Processor(ORDERS_QUEUE_NAME)
export class OrderService {
  constructor(
    @InjectModel('Order') private orderModel: Model<Order>,
    @InjectQueue(ORDERS_QUEUE_NAME) private ordersQueue: Queue,
    private userService: UserService,
  ) {}

  async createOrder(orderInput: OrderInputDto): Promise<JobId> {
    const job = await this.ordersQueue.add(orderInput);
    console.log(
      'Job created with ID ' + job.id + ' for ' + JSON.stringify(job.data),
    );
    return job.id;
  }

  @Process()
  async orderConsumer(job: Job): Promise<void> {
    try {
      const orderInputDto = job.data as OrderInputDto;
      orderInputDto.user = Types.ObjectId(orderInputDto.user.toString());
      orderInputDto.products = orderInputDto.products.map((productObj) => {
        const productId = Types.ObjectId(productObj.product.toString());
        productObj.product = productId;
        return productObj;
      });
      const newOrder = await this.orderModel.create(orderInputDto);
      if (newOrder) {
        await this.userService.addOrderToUser(newOrder);
        await job.moveToCompleted(JSON.stringify(newOrder));
      }
    } catch (error) {
      console.log(error);
      job.moveToFailed(error.message);
    }
  }
}
