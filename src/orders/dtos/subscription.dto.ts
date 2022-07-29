import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Order } from "../models/order.model";

@ObjectType()
export class SubscriptionOutput {
    @Field(() => Int)
    orderId: number;

    @Field(() => Order)
    order: Order;
}
