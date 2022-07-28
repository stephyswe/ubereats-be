## User Entity:

- id
- createdAt
- updatedAt
- email
- password
- role(client|owner|delivery)

## User CRUD:

* Create Account
* Log In
* See Profile
* Edit Profile
* Verify Email

## Restaurant CRUD:

* Edit Restaurant 
* Delete Restaurant

* See Categories
* See Restaurants by Category (pagination)
* See Restaurants (pagination)
* See Restaurant
* Search Restaurant

* Create Dish
* Edit Dish
* Delete Dish

## Orders CRUD
* Create Orders 
* Read Orders
* Read Order
* Update Order
- Orders D

* Orders Subscription 
* Pending Orders (s: newOrder) (t: createOrder(newOrder))
* Cooked Order (Delivery) (s: cookedOrder) (t: updateOrder(cookedOrder))
* Order Status (Customer, Delivery, Owner) (s: orderUpdate) (t: updateOrder(orderUpdate))
- Pending Pickup Order (Delivery) (s: orderUpdate) (t: updateOrder(orderUpdate))

- Payments Cron Jobs
- Payments (Paddle - alt. to Stripe)

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
