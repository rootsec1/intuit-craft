import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobId, Queue } from 'bull';
import { Model, Types } from 'mongoose';
import { ORDERS_QUEUE_NAME } from 'src/constants';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';
import { OrderStatusUpdateDto } from './dto/order-status-update.dto';
import { OrderInputDto } from './dto/order.input.dto';
import { Order } from './model/order.schema';

@Injectable()
@Processor(ORDERS_QUEUE_NAME)
export class OrderService {
  constructor(
    @InjectModel('Order') private orderModel: Model<Order>,
    @InjectQueue(ORDERS_QUEUE_NAME) private ordersQueue: Queue,
    private userService: UserService,
    private productService: ProductService,
  ) {}

  async createOrder(orderInput: OrderInputDto): Promise<JobId> {
    const job = await this.ordersQueue.add(orderInput);
    return job.id;
  }

  async getOrdersByUser(user: Types.ObjectId): Promise<Order[]> {
    return this.orderModel.find({ user }).populate({
      path: 'products.product',
      model: 'Product',
    });
  }

  async updateOrderStatus(
    orderStatusUpdateDto: OrderStatusUpdateDto,
  ): Promise<Order> {
    return this.orderModel.findByIdAndUpdate(
      orderStatusUpdateDto.orderId,
      {
        $set: {
          status: orderStatusUpdateDto.status,
          _id: Types.ObjectId(orderStatusUpdateDto.orderId.toString()),
        },
      },
      { new: true },
    );
  }

  @Process()
  async orderConsumer(job: Job): Promise<void> {
    try {
      const orderInputDto = job.data as OrderInputDto;
      orderInputDto.user = Types.ObjectId(orderInputDto.user.toString());
      let amount = 0;
      const orderPromise = orderInputDto.products.map(async (productObj) => {
        const productId = Types.ObjectId(productObj.product.toString());
        const productDoc = await this.productService.getProductById(productId);
        amount += productDoc.price * productObj.quantity;
        productObj.product = productId;
        return productObj;
      });
      orderInputDto.products = await Promise.all(orderPromise);
      orderInputDto.amount = amount;
      const newOrder = await this.orderModel.create(orderInputDto);
      if (newOrder) {
        await this.userService.addOrderToUser(newOrder);
        const nextJob = await job.moveToCompleted(JSON.stringify(newOrder));
        if (!nextJob) await this.ordersQueue.clean(0);
      }
    } catch (error) {
      console.log(error);
      job.moveToFailed(error.message);
    }
  }
}
