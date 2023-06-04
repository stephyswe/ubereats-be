import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { upperDirectiveTransformer } from './common/directives/upper-case.directive';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(private configService: ConfigService) {}
  createGqlOptions(): ApolloDriverConfig {
    return {
      // schema options
      introspection: true,
      persistedQueries: false,
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      transformSchema: (schema) => upperDirectiveTransformer(schema, 'upper'),
      context: (ctx) => {
        let token: any;
        if (ctx.connectionParams) {
          token = ctx.connectionParams['x-jwt'];
        } else {
          token = ctx.req.headers['x-jwt'];
        }

        return {
          req: {
            headers: {
              'x-jwt': token,
            },
          },
        };
      },
      // subscriptions options
      installSubscriptionHandlers: true,
      playground: false,
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      plugins: [
        process.env.NODE_ENV === 'production'
          ? ApolloServerPluginLandingPageProductionDefault()
          : ApolloServerPluginLandingPageLocalDefault(),
      ],
    };
  }
}
