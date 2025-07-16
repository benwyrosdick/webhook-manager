
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model WebhookRequest
 * 
 */
export type WebhookRequest = $Result.DefaultSelection<Prisma.$WebhookRequestPayload>
/**
 * Model UrlMapping
 * 
 */
export type UrlMapping = $Result.DefaultSelection<Prisma.$UrlMappingPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more WebhookRequests
 * const webhookRequests = await prisma.webhookRequest.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more WebhookRequests
   * const webhookRequests = await prisma.webhookRequest.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.webhookRequest`: Exposes CRUD operations for the **WebhookRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WebhookRequests
    * const webhookRequests = await prisma.webhookRequest.findMany()
    * ```
    */
  get webhookRequest(): Prisma.WebhookRequestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.urlMapping`: Exposes CRUD operations for the **UrlMapping** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UrlMappings
    * const urlMappings = await prisma.urlMapping.findMany()
    * ```
    */
  get urlMapping(): Prisma.UrlMappingDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.12.0
   * Query Engine version: 8047c96bbd92db98a2abc7c9323ce77c02c89dbc
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    WebhookRequest: 'WebhookRequest',
    UrlMapping: 'UrlMapping'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "webhookRequest" | "urlMapping"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      WebhookRequest: {
        payload: Prisma.$WebhookRequestPayload<ExtArgs>
        fields: Prisma.WebhookRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WebhookRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WebhookRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookRequestPayload>
          }
          findFirst: {
            args: Prisma.WebhookRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WebhookRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookRequestPayload>
          }
          findMany: {
            args: Prisma.WebhookRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookRequestPayload>[]
          }
          create: {
            args: Prisma.WebhookRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookRequestPayload>
          }
          createMany: {
            args: Prisma.WebhookRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WebhookRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookRequestPayload>[]
          }
          delete: {
            args: Prisma.WebhookRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookRequestPayload>
          }
          update: {
            args: Prisma.WebhookRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookRequestPayload>
          }
          deleteMany: {
            args: Prisma.WebhookRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WebhookRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WebhookRequestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookRequestPayload>[]
          }
          upsert: {
            args: Prisma.WebhookRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookRequestPayload>
          }
          aggregate: {
            args: Prisma.WebhookRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWebhookRequest>
          }
          groupBy: {
            args: Prisma.WebhookRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<WebhookRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.WebhookRequestCountArgs<ExtArgs>
            result: $Utils.Optional<WebhookRequestCountAggregateOutputType> | number
          }
        }
      }
      UrlMapping: {
        payload: Prisma.$UrlMappingPayload<ExtArgs>
        fields: Prisma.UrlMappingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UrlMappingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrlMappingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UrlMappingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrlMappingPayload>
          }
          findFirst: {
            args: Prisma.UrlMappingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrlMappingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UrlMappingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrlMappingPayload>
          }
          findMany: {
            args: Prisma.UrlMappingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrlMappingPayload>[]
          }
          create: {
            args: Prisma.UrlMappingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrlMappingPayload>
          }
          createMany: {
            args: Prisma.UrlMappingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UrlMappingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrlMappingPayload>[]
          }
          delete: {
            args: Prisma.UrlMappingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrlMappingPayload>
          }
          update: {
            args: Prisma.UrlMappingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrlMappingPayload>
          }
          deleteMany: {
            args: Prisma.UrlMappingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UrlMappingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UrlMappingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrlMappingPayload>[]
          }
          upsert: {
            args: Prisma.UrlMappingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UrlMappingPayload>
          }
          aggregate: {
            args: Prisma.UrlMappingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUrlMapping>
          }
          groupBy: {
            args: Prisma.UrlMappingGroupByArgs<ExtArgs>
            result: $Utils.Optional<UrlMappingGroupByOutputType>[]
          }
          count: {
            args: Prisma.UrlMappingCountArgs<ExtArgs>
            result: $Utils.Optional<UrlMappingCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    webhookRequest?: WebhookRequestOmit
    urlMapping?: UrlMappingOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model WebhookRequest
   */

  export type AggregateWebhookRequest = {
    _count: WebhookRequestCountAggregateOutputType | null
    _avg: WebhookRequestAvgAggregateOutputType | null
    _sum: WebhookRequestSumAggregateOutputType | null
    _min: WebhookRequestMinAggregateOutputType | null
    _max: WebhookRequestMaxAggregateOutputType | null
  }

  export type WebhookRequestAvgAggregateOutputType = {
    id: number | null
  }

  export type WebhookRequestSumAggregateOutputType = {
    id: number | null
  }

  export type WebhookRequestMinAggregateOutputType = {
    id: number | null
    method: string | null
    url: string | null
    headers: string | null
    body: string | null
    queryParams: string | null
    timestamp: Date | null
    ipAddress: string | null
    userAgent: string | null
  }

  export type WebhookRequestMaxAggregateOutputType = {
    id: number | null
    method: string | null
    url: string | null
    headers: string | null
    body: string | null
    queryParams: string | null
    timestamp: Date | null
    ipAddress: string | null
    userAgent: string | null
  }

  export type WebhookRequestCountAggregateOutputType = {
    id: number
    method: number
    url: number
    headers: number
    body: number
    queryParams: number
    timestamp: number
    ipAddress: number
    userAgent: number
    _all: number
  }


  export type WebhookRequestAvgAggregateInputType = {
    id?: true
  }

  export type WebhookRequestSumAggregateInputType = {
    id?: true
  }

  export type WebhookRequestMinAggregateInputType = {
    id?: true
    method?: true
    url?: true
    headers?: true
    body?: true
    queryParams?: true
    timestamp?: true
    ipAddress?: true
    userAgent?: true
  }

  export type WebhookRequestMaxAggregateInputType = {
    id?: true
    method?: true
    url?: true
    headers?: true
    body?: true
    queryParams?: true
    timestamp?: true
    ipAddress?: true
    userAgent?: true
  }

  export type WebhookRequestCountAggregateInputType = {
    id?: true
    method?: true
    url?: true
    headers?: true
    body?: true
    queryParams?: true
    timestamp?: true
    ipAddress?: true
    userAgent?: true
    _all?: true
  }

  export type WebhookRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WebhookRequest to aggregate.
     */
    where?: WebhookRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebhookRequests to fetch.
     */
    orderBy?: WebhookRequestOrderByWithRelationInput | WebhookRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WebhookRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebhookRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebhookRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WebhookRequests
    **/
    _count?: true | WebhookRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WebhookRequestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WebhookRequestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WebhookRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WebhookRequestMaxAggregateInputType
  }

  export type GetWebhookRequestAggregateType<T extends WebhookRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateWebhookRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWebhookRequest[P]>
      : GetScalarType<T[P], AggregateWebhookRequest[P]>
  }




  export type WebhookRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WebhookRequestWhereInput
    orderBy?: WebhookRequestOrderByWithAggregationInput | WebhookRequestOrderByWithAggregationInput[]
    by: WebhookRequestScalarFieldEnum[] | WebhookRequestScalarFieldEnum
    having?: WebhookRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WebhookRequestCountAggregateInputType | true
    _avg?: WebhookRequestAvgAggregateInputType
    _sum?: WebhookRequestSumAggregateInputType
    _min?: WebhookRequestMinAggregateInputType
    _max?: WebhookRequestMaxAggregateInputType
  }

  export type WebhookRequestGroupByOutputType = {
    id: number
    method: string
    url: string
    headers: string | null
    body: string | null
    queryParams: string | null
    timestamp: Date
    ipAddress: string | null
    userAgent: string | null
    _count: WebhookRequestCountAggregateOutputType | null
    _avg: WebhookRequestAvgAggregateOutputType | null
    _sum: WebhookRequestSumAggregateOutputType | null
    _min: WebhookRequestMinAggregateOutputType | null
    _max: WebhookRequestMaxAggregateOutputType | null
  }

  type GetWebhookRequestGroupByPayload<T extends WebhookRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WebhookRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WebhookRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WebhookRequestGroupByOutputType[P]>
            : GetScalarType<T[P], WebhookRequestGroupByOutputType[P]>
        }
      >
    >


  export type WebhookRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    method?: boolean
    url?: boolean
    headers?: boolean
    body?: boolean
    queryParams?: boolean
    timestamp?: boolean
    ipAddress?: boolean
    userAgent?: boolean
  }, ExtArgs["result"]["webhookRequest"]>

  export type WebhookRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    method?: boolean
    url?: boolean
    headers?: boolean
    body?: boolean
    queryParams?: boolean
    timestamp?: boolean
    ipAddress?: boolean
    userAgent?: boolean
  }, ExtArgs["result"]["webhookRequest"]>

  export type WebhookRequestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    method?: boolean
    url?: boolean
    headers?: boolean
    body?: boolean
    queryParams?: boolean
    timestamp?: boolean
    ipAddress?: boolean
    userAgent?: boolean
  }, ExtArgs["result"]["webhookRequest"]>

  export type WebhookRequestSelectScalar = {
    id?: boolean
    method?: boolean
    url?: boolean
    headers?: boolean
    body?: boolean
    queryParams?: boolean
    timestamp?: boolean
    ipAddress?: boolean
    userAgent?: boolean
  }

  export type WebhookRequestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "method" | "url" | "headers" | "body" | "queryParams" | "timestamp" | "ipAddress" | "userAgent", ExtArgs["result"]["webhookRequest"]>

  export type $WebhookRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WebhookRequest"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      method: string
      url: string
      headers: string | null
      body: string | null
      queryParams: string | null
      timestamp: Date
      ipAddress: string | null
      userAgent: string | null
    }, ExtArgs["result"]["webhookRequest"]>
    composites: {}
  }

  type WebhookRequestGetPayload<S extends boolean | null | undefined | WebhookRequestDefaultArgs> = $Result.GetResult<Prisma.$WebhookRequestPayload, S>

  type WebhookRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WebhookRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WebhookRequestCountAggregateInputType | true
    }

  export interface WebhookRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WebhookRequest'], meta: { name: 'WebhookRequest' } }
    /**
     * Find zero or one WebhookRequest that matches the filter.
     * @param {WebhookRequestFindUniqueArgs} args - Arguments to find a WebhookRequest
     * @example
     * // Get one WebhookRequest
     * const webhookRequest = await prisma.webhookRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WebhookRequestFindUniqueArgs>(args: SelectSubset<T, WebhookRequestFindUniqueArgs<ExtArgs>>): Prisma__WebhookRequestClient<$Result.GetResult<Prisma.$WebhookRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WebhookRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WebhookRequestFindUniqueOrThrowArgs} args - Arguments to find a WebhookRequest
     * @example
     * // Get one WebhookRequest
     * const webhookRequest = await prisma.webhookRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WebhookRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, WebhookRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WebhookRequestClient<$Result.GetResult<Prisma.$WebhookRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WebhookRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookRequestFindFirstArgs} args - Arguments to find a WebhookRequest
     * @example
     * // Get one WebhookRequest
     * const webhookRequest = await prisma.webhookRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WebhookRequestFindFirstArgs>(args?: SelectSubset<T, WebhookRequestFindFirstArgs<ExtArgs>>): Prisma__WebhookRequestClient<$Result.GetResult<Prisma.$WebhookRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WebhookRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookRequestFindFirstOrThrowArgs} args - Arguments to find a WebhookRequest
     * @example
     * // Get one WebhookRequest
     * const webhookRequest = await prisma.webhookRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WebhookRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, WebhookRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__WebhookRequestClient<$Result.GetResult<Prisma.$WebhookRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WebhookRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WebhookRequests
     * const webhookRequests = await prisma.webhookRequest.findMany()
     * 
     * // Get first 10 WebhookRequests
     * const webhookRequests = await prisma.webhookRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const webhookRequestWithIdOnly = await prisma.webhookRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WebhookRequestFindManyArgs>(args?: SelectSubset<T, WebhookRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebhookRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WebhookRequest.
     * @param {WebhookRequestCreateArgs} args - Arguments to create a WebhookRequest.
     * @example
     * // Create one WebhookRequest
     * const WebhookRequest = await prisma.webhookRequest.create({
     *   data: {
     *     // ... data to create a WebhookRequest
     *   }
     * })
     * 
     */
    create<T extends WebhookRequestCreateArgs>(args: SelectSubset<T, WebhookRequestCreateArgs<ExtArgs>>): Prisma__WebhookRequestClient<$Result.GetResult<Prisma.$WebhookRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WebhookRequests.
     * @param {WebhookRequestCreateManyArgs} args - Arguments to create many WebhookRequests.
     * @example
     * // Create many WebhookRequests
     * const webhookRequest = await prisma.webhookRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WebhookRequestCreateManyArgs>(args?: SelectSubset<T, WebhookRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WebhookRequests and returns the data saved in the database.
     * @param {WebhookRequestCreateManyAndReturnArgs} args - Arguments to create many WebhookRequests.
     * @example
     * // Create many WebhookRequests
     * const webhookRequest = await prisma.webhookRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WebhookRequests and only return the `id`
     * const webhookRequestWithIdOnly = await prisma.webhookRequest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WebhookRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, WebhookRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebhookRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WebhookRequest.
     * @param {WebhookRequestDeleteArgs} args - Arguments to delete one WebhookRequest.
     * @example
     * // Delete one WebhookRequest
     * const WebhookRequest = await prisma.webhookRequest.delete({
     *   where: {
     *     // ... filter to delete one WebhookRequest
     *   }
     * })
     * 
     */
    delete<T extends WebhookRequestDeleteArgs>(args: SelectSubset<T, WebhookRequestDeleteArgs<ExtArgs>>): Prisma__WebhookRequestClient<$Result.GetResult<Prisma.$WebhookRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WebhookRequest.
     * @param {WebhookRequestUpdateArgs} args - Arguments to update one WebhookRequest.
     * @example
     * // Update one WebhookRequest
     * const webhookRequest = await prisma.webhookRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WebhookRequestUpdateArgs>(args: SelectSubset<T, WebhookRequestUpdateArgs<ExtArgs>>): Prisma__WebhookRequestClient<$Result.GetResult<Prisma.$WebhookRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WebhookRequests.
     * @param {WebhookRequestDeleteManyArgs} args - Arguments to filter WebhookRequests to delete.
     * @example
     * // Delete a few WebhookRequests
     * const { count } = await prisma.webhookRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WebhookRequestDeleteManyArgs>(args?: SelectSubset<T, WebhookRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WebhookRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WebhookRequests
     * const webhookRequest = await prisma.webhookRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WebhookRequestUpdateManyArgs>(args: SelectSubset<T, WebhookRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WebhookRequests and returns the data updated in the database.
     * @param {WebhookRequestUpdateManyAndReturnArgs} args - Arguments to update many WebhookRequests.
     * @example
     * // Update many WebhookRequests
     * const webhookRequest = await prisma.webhookRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WebhookRequests and only return the `id`
     * const webhookRequestWithIdOnly = await prisma.webhookRequest.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WebhookRequestUpdateManyAndReturnArgs>(args: SelectSubset<T, WebhookRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebhookRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WebhookRequest.
     * @param {WebhookRequestUpsertArgs} args - Arguments to update or create a WebhookRequest.
     * @example
     * // Update or create a WebhookRequest
     * const webhookRequest = await prisma.webhookRequest.upsert({
     *   create: {
     *     // ... data to create a WebhookRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WebhookRequest we want to update
     *   }
     * })
     */
    upsert<T extends WebhookRequestUpsertArgs>(args: SelectSubset<T, WebhookRequestUpsertArgs<ExtArgs>>): Prisma__WebhookRequestClient<$Result.GetResult<Prisma.$WebhookRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WebhookRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookRequestCountArgs} args - Arguments to filter WebhookRequests to count.
     * @example
     * // Count the number of WebhookRequests
     * const count = await prisma.webhookRequest.count({
     *   where: {
     *     // ... the filter for the WebhookRequests we want to count
     *   }
     * })
    **/
    count<T extends WebhookRequestCountArgs>(
      args?: Subset<T, WebhookRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WebhookRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WebhookRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WebhookRequestAggregateArgs>(args: Subset<T, WebhookRequestAggregateArgs>): Prisma.PrismaPromise<GetWebhookRequestAggregateType<T>>

    /**
     * Group by WebhookRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WebhookRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WebhookRequestGroupByArgs['orderBy'] }
        : { orderBy?: WebhookRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WebhookRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWebhookRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WebhookRequest model
   */
  readonly fields: WebhookRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WebhookRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WebhookRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WebhookRequest model
   */
  interface WebhookRequestFieldRefs {
    readonly id: FieldRef<"WebhookRequest", 'Int'>
    readonly method: FieldRef<"WebhookRequest", 'String'>
    readonly url: FieldRef<"WebhookRequest", 'String'>
    readonly headers: FieldRef<"WebhookRequest", 'String'>
    readonly body: FieldRef<"WebhookRequest", 'String'>
    readonly queryParams: FieldRef<"WebhookRequest", 'String'>
    readonly timestamp: FieldRef<"WebhookRequest", 'DateTime'>
    readonly ipAddress: FieldRef<"WebhookRequest", 'String'>
    readonly userAgent: FieldRef<"WebhookRequest", 'String'>
  }
    

  // Custom InputTypes
  /**
   * WebhookRequest findUnique
   */
  export type WebhookRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookRequest
     */
    select?: WebhookRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookRequest
     */
    omit?: WebhookRequestOmit<ExtArgs> | null
    /**
     * Filter, which WebhookRequest to fetch.
     */
    where: WebhookRequestWhereUniqueInput
  }

  /**
   * WebhookRequest findUniqueOrThrow
   */
  export type WebhookRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookRequest
     */
    select?: WebhookRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookRequest
     */
    omit?: WebhookRequestOmit<ExtArgs> | null
    /**
     * Filter, which WebhookRequest to fetch.
     */
    where: WebhookRequestWhereUniqueInput
  }

  /**
   * WebhookRequest findFirst
   */
  export type WebhookRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookRequest
     */
    select?: WebhookRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookRequest
     */
    omit?: WebhookRequestOmit<ExtArgs> | null
    /**
     * Filter, which WebhookRequest to fetch.
     */
    where?: WebhookRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebhookRequests to fetch.
     */
    orderBy?: WebhookRequestOrderByWithRelationInput | WebhookRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WebhookRequests.
     */
    cursor?: WebhookRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebhookRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebhookRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WebhookRequests.
     */
    distinct?: WebhookRequestScalarFieldEnum | WebhookRequestScalarFieldEnum[]
  }

  /**
   * WebhookRequest findFirstOrThrow
   */
  export type WebhookRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookRequest
     */
    select?: WebhookRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookRequest
     */
    omit?: WebhookRequestOmit<ExtArgs> | null
    /**
     * Filter, which WebhookRequest to fetch.
     */
    where?: WebhookRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebhookRequests to fetch.
     */
    orderBy?: WebhookRequestOrderByWithRelationInput | WebhookRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WebhookRequests.
     */
    cursor?: WebhookRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebhookRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebhookRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WebhookRequests.
     */
    distinct?: WebhookRequestScalarFieldEnum | WebhookRequestScalarFieldEnum[]
  }

  /**
   * WebhookRequest findMany
   */
  export type WebhookRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookRequest
     */
    select?: WebhookRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookRequest
     */
    omit?: WebhookRequestOmit<ExtArgs> | null
    /**
     * Filter, which WebhookRequests to fetch.
     */
    where?: WebhookRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebhookRequests to fetch.
     */
    orderBy?: WebhookRequestOrderByWithRelationInput | WebhookRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WebhookRequests.
     */
    cursor?: WebhookRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebhookRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebhookRequests.
     */
    skip?: number
    distinct?: WebhookRequestScalarFieldEnum | WebhookRequestScalarFieldEnum[]
  }

  /**
   * WebhookRequest create
   */
  export type WebhookRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookRequest
     */
    select?: WebhookRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookRequest
     */
    omit?: WebhookRequestOmit<ExtArgs> | null
    /**
     * The data needed to create a WebhookRequest.
     */
    data: XOR<WebhookRequestCreateInput, WebhookRequestUncheckedCreateInput>
  }

  /**
   * WebhookRequest createMany
   */
  export type WebhookRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WebhookRequests.
     */
    data: WebhookRequestCreateManyInput | WebhookRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WebhookRequest createManyAndReturn
   */
  export type WebhookRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookRequest
     */
    select?: WebhookRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookRequest
     */
    omit?: WebhookRequestOmit<ExtArgs> | null
    /**
     * The data used to create many WebhookRequests.
     */
    data: WebhookRequestCreateManyInput | WebhookRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WebhookRequest update
   */
  export type WebhookRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookRequest
     */
    select?: WebhookRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookRequest
     */
    omit?: WebhookRequestOmit<ExtArgs> | null
    /**
     * The data needed to update a WebhookRequest.
     */
    data: XOR<WebhookRequestUpdateInput, WebhookRequestUncheckedUpdateInput>
    /**
     * Choose, which WebhookRequest to update.
     */
    where: WebhookRequestWhereUniqueInput
  }

  /**
   * WebhookRequest updateMany
   */
  export type WebhookRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WebhookRequests.
     */
    data: XOR<WebhookRequestUpdateManyMutationInput, WebhookRequestUncheckedUpdateManyInput>
    /**
     * Filter which WebhookRequests to update
     */
    where?: WebhookRequestWhereInput
    /**
     * Limit how many WebhookRequests to update.
     */
    limit?: number
  }

  /**
   * WebhookRequest updateManyAndReturn
   */
  export type WebhookRequestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookRequest
     */
    select?: WebhookRequestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookRequest
     */
    omit?: WebhookRequestOmit<ExtArgs> | null
    /**
     * The data used to update WebhookRequests.
     */
    data: XOR<WebhookRequestUpdateManyMutationInput, WebhookRequestUncheckedUpdateManyInput>
    /**
     * Filter which WebhookRequests to update
     */
    where?: WebhookRequestWhereInput
    /**
     * Limit how many WebhookRequests to update.
     */
    limit?: number
  }

  /**
   * WebhookRequest upsert
   */
  export type WebhookRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookRequest
     */
    select?: WebhookRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookRequest
     */
    omit?: WebhookRequestOmit<ExtArgs> | null
    /**
     * The filter to search for the WebhookRequest to update in case it exists.
     */
    where: WebhookRequestWhereUniqueInput
    /**
     * In case the WebhookRequest found by the `where` argument doesn't exist, create a new WebhookRequest with this data.
     */
    create: XOR<WebhookRequestCreateInput, WebhookRequestUncheckedCreateInput>
    /**
     * In case the WebhookRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WebhookRequestUpdateInput, WebhookRequestUncheckedUpdateInput>
  }

  /**
   * WebhookRequest delete
   */
  export type WebhookRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookRequest
     */
    select?: WebhookRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookRequest
     */
    omit?: WebhookRequestOmit<ExtArgs> | null
    /**
     * Filter which WebhookRequest to delete.
     */
    where: WebhookRequestWhereUniqueInput
  }

  /**
   * WebhookRequest deleteMany
   */
  export type WebhookRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WebhookRequests to delete
     */
    where?: WebhookRequestWhereInput
    /**
     * Limit how many WebhookRequests to delete.
     */
    limit?: number
  }

  /**
   * WebhookRequest without action
   */
  export type WebhookRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookRequest
     */
    select?: WebhookRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookRequest
     */
    omit?: WebhookRequestOmit<ExtArgs> | null
  }


  /**
   * Model UrlMapping
   */

  export type AggregateUrlMapping = {
    _count: UrlMappingCountAggregateOutputType | null
    _avg: UrlMappingAvgAggregateOutputType | null
    _sum: UrlMappingSumAggregateOutputType | null
    _min: UrlMappingMinAggregateOutputType | null
    _max: UrlMappingMaxAggregateOutputType | null
  }

  export type UrlMappingAvgAggregateOutputType = {
    id: number | null
  }

  export type UrlMappingSumAggregateOutputType = {
    id: number | null
  }

  export type UrlMappingMinAggregateOutputType = {
    id: number | null
    webhookPath: string | null
    targetUrl: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UrlMappingMaxAggregateOutputType = {
    id: number | null
    webhookPath: string | null
    targetUrl: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UrlMappingCountAggregateOutputType = {
    id: number
    webhookPath: number
    targetUrl: number
    active: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UrlMappingAvgAggregateInputType = {
    id?: true
  }

  export type UrlMappingSumAggregateInputType = {
    id?: true
  }

  export type UrlMappingMinAggregateInputType = {
    id?: true
    webhookPath?: true
    targetUrl?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UrlMappingMaxAggregateInputType = {
    id?: true
    webhookPath?: true
    targetUrl?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UrlMappingCountAggregateInputType = {
    id?: true
    webhookPath?: true
    targetUrl?: true
    active?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UrlMappingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UrlMapping to aggregate.
     */
    where?: UrlMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UrlMappings to fetch.
     */
    orderBy?: UrlMappingOrderByWithRelationInput | UrlMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UrlMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UrlMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UrlMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UrlMappings
    **/
    _count?: true | UrlMappingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UrlMappingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UrlMappingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UrlMappingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UrlMappingMaxAggregateInputType
  }

  export type GetUrlMappingAggregateType<T extends UrlMappingAggregateArgs> = {
        [P in keyof T & keyof AggregateUrlMapping]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUrlMapping[P]>
      : GetScalarType<T[P], AggregateUrlMapping[P]>
  }




  export type UrlMappingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UrlMappingWhereInput
    orderBy?: UrlMappingOrderByWithAggregationInput | UrlMappingOrderByWithAggregationInput[]
    by: UrlMappingScalarFieldEnum[] | UrlMappingScalarFieldEnum
    having?: UrlMappingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UrlMappingCountAggregateInputType | true
    _avg?: UrlMappingAvgAggregateInputType
    _sum?: UrlMappingSumAggregateInputType
    _min?: UrlMappingMinAggregateInputType
    _max?: UrlMappingMaxAggregateInputType
  }

  export type UrlMappingGroupByOutputType = {
    id: number
    webhookPath: string
    targetUrl: string
    active: boolean
    createdAt: Date
    updatedAt: Date
    _count: UrlMappingCountAggregateOutputType | null
    _avg: UrlMappingAvgAggregateOutputType | null
    _sum: UrlMappingSumAggregateOutputType | null
    _min: UrlMappingMinAggregateOutputType | null
    _max: UrlMappingMaxAggregateOutputType | null
  }

  type GetUrlMappingGroupByPayload<T extends UrlMappingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UrlMappingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UrlMappingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UrlMappingGroupByOutputType[P]>
            : GetScalarType<T[P], UrlMappingGroupByOutputType[P]>
        }
      >
    >


  export type UrlMappingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    webhookPath?: boolean
    targetUrl?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["urlMapping"]>

  export type UrlMappingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    webhookPath?: boolean
    targetUrl?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["urlMapping"]>

  export type UrlMappingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    webhookPath?: boolean
    targetUrl?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["urlMapping"]>

  export type UrlMappingSelectScalar = {
    id?: boolean
    webhookPath?: boolean
    targetUrl?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UrlMappingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "webhookPath" | "targetUrl" | "active" | "createdAt" | "updatedAt", ExtArgs["result"]["urlMapping"]>

  export type $UrlMappingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UrlMapping"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      webhookPath: string
      targetUrl: string
      active: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["urlMapping"]>
    composites: {}
  }

  type UrlMappingGetPayload<S extends boolean | null | undefined | UrlMappingDefaultArgs> = $Result.GetResult<Prisma.$UrlMappingPayload, S>

  type UrlMappingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UrlMappingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UrlMappingCountAggregateInputType | true
    }

  export interface UrlMappingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UrlMapping'], meta: { name: 'UrlMapping' } }
    /**
     * Find zero or one UrlMapping that matches the filter.
     * @param {UrlMappingFindUniqueArgs} args - Arguments to find a UrlMapping
     * @example
     * // Get one UrlMapping
     * const urlMapping = await prisma.urlMapping.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UrlMappingFindUniqueArgs>(args: SelectSubset<T, UrlMappingFindUniqueArgs<ExtArgs>>): Prisma__UrlMappingClient<$Result.GetResult<Prisma.$UrlMappingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UrlMapping that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UrlMappingFindUniqueOrThrowArgs} args - Arguments to find a UrlMapping
     * @example
     * // Get one UrlMapping
     * const urlMapping = await prisma.urlMapping.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UrlMappingFindUniqueOrThrowArgs>(args: SelectSubset<T, UrlMappingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UrlMappingClient<$Result.GetResult<Prisma.$UrlMappingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UrlMapping that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UrlMappingFindFirstArgs} args - Arguments to find a UrlMapping
     * @example
     * // Get one UrlMapping
     * const urlMapping = await prisma.urlMapping.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UrlMappingFindFirstArgs>(args?: SelectSubset<T, UrlMappingFindFirstArgs<ExtArgs>>): Prisma__UrlMappingClient<$Result.GetResult<Prisma.$UrlMappingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UrlMapping that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UrlMappingFindFirstOrThrowArgs} args - Arguments to find a UrlMapping
     * @example
     * // Get one UrlMapping
     * const urlMapping = await prisma.urlMapping.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UrlMappingFindFirstOrThrowArgs>(args?: SelectSubset<T, UrlMappingFindFirstOrThrowArgs<ExtArgs>>): Prisma__UrlMappingClient<$Result.GetResult<Prisma.$UrlMappingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UrlMappings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UrlMappingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UrlMappings
     * const urlMappings = await prisma.urlMapping.findMany()
     * 
     * // Get first 10 UrlMappings
     * const urlMappings = await prisma.urlMapping.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const urlMappingWithIdOnly = await prisma.urlMapping.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UrlMappingFindManyArgs>(args?: SelectSubset<T, UrlMappingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UrlMappingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UrlMapping.
     * @param {UrlMappingCreateArgs} args - Arguments to create a UrlMapping.
     * @example
     * // Create one UrlMapping
     * const UrlMapping = await prisma.urlMapping.create({
     *   data: {
     *     // ... data to create a UrlMapping
     *   }
     * })
     * 
     */
    create<T extends UrlMappingCreateArgs>(args: SelectSubset<T, UrlMappingCreateArgs<ExtArgs>>): Prisma__UrlMappingClient<$Result.GetResult<Prisma.$UrlMappingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UrlMappings.
     * @param {UrlMappingCreateManyArgs} args - Arguments to create many UrlMappings.
     * @example
     * // Create many UrlMappings
     * const urlMapping = await prisma.urlMapping.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UrlMappingCreateManyArgs>(args?: SelectSubset<T, UrlMappingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UrlMappings and returns the data saved in the database.
     * @param {UrlMappingCreateManyAndReturnArgs} args - Arguments to create many UrlMappings.
     * @example
     * // Create many UrlMappings
     * const urlMapping = await prisma.urlMapping.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UrlMappings and only return the `id`
     * const urlMappingWithIdOnly = await prisma.urlMapping.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UrlMappingCreateManyAndReturnArgs>(args?: SelectSubset<T, UrlMappingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UrlMappingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UrlMapping.
     * @param {UrlMappingDeleteArgs} args - Arguments to delete one UrlMapping.
     * @example
     * // Delete one UrlMapping
     * const UrlMapping = await prisma.urlMapping.delete({
     *   where: {
     *     // ... filter to delete one UrlMapping
     *   }
     * })
     * 
     */
    delete<T extends UrlMappingDeleteArgs>(args: SelectSubset<T, UrlMappingDeleteArgs<ExtArgs>>): Prisma__UrlMappingClient<$Result.GetResult<Prisma.$UrlMappingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UrlMapping.
     * @param {UrlMappingUpdateArgs} args - Arguments to update one UrlMapping.
     * @example
     * // Update one UrlMapping
     * const urlMapping = await prisma.urlMapping.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UrlMappingUpdateArgs>(args: SelectSubset<T, UrlMappingUpdateArgs<ExtArgs>>): Prisma__UrlMappingClient<$Result.GetResult<Prisma.$UrlMappingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UrlMappings.
     * @param {UrlMappingDeleteManyArgs} args - Arguments to filter UrlMappings to delete.
     * @example
     * // Delete a few UrlMappings
     * const { count } = await prisma.urlMapping.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UrlMappingDeleteManyArgs>(args?: SelectSubset<T, UrlMappingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UrlMappings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UrlMappingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UrlMappings
     * const urlMapping = await prisma.urlMapping.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UrlMappingUpdateManyArgs>(args: SelectSubset<T, UrlMappingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UrlMappings and returns the data updated in the database.
     * @param {UrlMappingUpdateManyAndReturnArgs} args - Arguments to update many UrlMappings.
     * @example
     * // Update many UrlMappings
     * const urlMapping = await prisma.urlMapping.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UrlMappings and only return the `id`
     * const urlMappingWithIdOnly = await prisma.urlMapping.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UrlMappingUpdateManyAndReturnArgs>(args: SelectSubset<T, UrlMappingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UrlMappingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UrlMapping.
     * @param {UrlMappingUpsertArgs} args - Arguments to update or create a UrlMapping.
     * @example
     * // Update or create a UrlMapping
     * const urlMapping = await prisma.urlMapping.upsert({
     *   create: {
     *     // ... data to create a UrlMapping
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UrlMapping we want to update
     *   }
     * })
     */
    upsert<T extends UrlMappingUpsertArgs>(args: SelectSubset<T, UrlMappingUpsertArgs<ExtArgs>>): Prisma__UrlMappingClient<$Result.GetResult<Prisma.$UrlMappingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UrlMappings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UrlMappingCountArgs} args - Arguments to filter UrlMappings to count.
     * @example
     * // Count the number of UrlMappings
     * const count = await prisma.urlMapping.count({
     *   where: {
     *     // ... the filter for the UrlMappings we want to count
     *   }
     * })
    **/
    count<T extends UrlMappingCountArgs>(
      args?: Subset<T, UrlMappingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UrlMappingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UrlMapping.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UrlMappingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UrlMappingAggregateArgs>(args: Subset<T, UrlMappingAggregateArgs>): Prisma.PrismaPromise<GetUrlMappingAggregateType<T>>

    /**
     * Group by UrlMapping.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UrlMappingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UrlMappingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UrlMappingGroupByArgs['orderBy'] }
        : { orderBy?: UrlMappingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UrlMappingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUrlMappingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UrlMapping model
   */
  readonly fields: UrlMappingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UrlMapping.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UrlMappingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UrlMapping model
   */
  interface UrlMappingFieldRefs {
    readonly id: FieldRef<"UrlMapping", 'Int'>
    readonly webhookPath: FieldRef<"UrlMapping", 'String'>
    readonly targetUrl: FieldRef<"UrlMapping", 'String'>
    readonly active: FieldRef<"UrlMapping", 'Boolean'>
    readonly createdAt: FieldRef<"UrlMapping", 'DateTime'>
    readonly updatedAt: FieldRef<"UrlMapping", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UrlMapping findUnique
   */
  export type UrlMappingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrlMapping
     */
    select?: UrlMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UrlMapping
     */
    omit?: UrlMappingOmit<ExtArgs> | null
    /**
     * Filter, which UrlMapping to fetch.
     */
    where: UrlMappingWhereUniqueInput
  }

  /**
   * UrlMapping findUniqueOrThrow
   */
  export type UrlMappingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrlMapping
     */
    select?: UrlMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UrlMapping
     */
    omit?: UrlMappingOmit<ExtArgs> | null
    /**
     * Filter, which UrlMapping to fetch.
     */
    where: UrlMappingWhereUniqueInput
  }

  /**
   * UrlMapping findFirst
   */
  export type UrlMappingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrlMapping
     */
    select?: UrlMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UrlMapping
     */
    omit?: UrlMappingOmit<ExtArgs> | null
    /**
     * Filter, which UrlMapping to fetch.
     */
    where?: UrlMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UrlMappings to fetch.
     */
    orderBy?: UrlMappingOrderByWithRelationInput | UrlMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UrlMappings.
     */
    cursor?: UrlMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UrlMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UrlMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UrlMappings.
     */
    distinct?: UrlMappingScalarFieldEnum | UrlMappingScalarFieldEnum[]
  }

  /**
   * UrlMapping findFirstOrThrow
   */
  export type UrlMappingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrlMapping
     */
    select?: UrlMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UrlMapping
     */
    omit?: UrlMappingOmit<ExtArgs> | null
    /**
     * Filter, which UrlMapping to fetch.
     */
    where?: UrlMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UrlMappings to fetch.
     */
    orderBy?: UrlMappingOrderByWithRelationInput | UrlMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UrlMappings.
     */
    cursor?: UrlMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UrlMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UrlMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UrlMappings.
     */
    distinct?: UrlMappingScalarFieldEnum | UrlMappingScalarFieldEnum[]
  }

  /**
   * UrlMapping findMany
   */
  export type UrlMappingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrlMapping
     */
    select?: UrlMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UrlMapping
     */
    omit?: UrlMappingOmit<ExtArgs> | null
    /**
     * Filter, which UrlMappings to fetch.
     */
    where?: UrlMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UrlMappings to fetch.
     */
    orderBy?: UrlMappingOrderByWithRelationInput | UrlMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UrlMappings.
     */
    cursor?: UrlMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UrlMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UrlMappings.
     */
    skip?: number
    distinct?: UrlMappingScalarFieldEnum | UrlMappingScalarFieldEnum[]
  }

  /**
   * UrlMapping create
   */
  export type UrlMappingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrlMapping
     */
    select?: UrlMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UrlMapping
     */
    omit?: UrlMappingOmit<ExtArgs> | null
    /**
     * The data needed to create a UrlMapping.
     */
    data: XOR<UrlMappingCreateInput, UrlMappingUncheckedCreateInput>
  }

  /**
   * UrlMapping createMany
   */
  export type UrlMappingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UrlMappings.
     */
    data: UrlMappingCreateManyInput | UrlMappingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UrlMapping createManyAndReturn
   */
  export type UrlMappingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrlMapping
     */
    select?: UrlMappingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UrlMapping
     */
    omit?: UrlMappingOmit<ExtArgs> | null
    /**
     * The data used to create many UrlMappings.
     */
    data: UrlMappingCreateManyInput | UrlMappingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UrlMapping update
   */
  export type UrlMappingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrlMapping
     */
    select?: UrlMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UrlMapping
     */
    omit?: UrlMappingOmit<ExtArgs> | null
    /**
     * The data needed to update a UrlMapping.
     */
    data: XOR<UrlMappingUpdateInput, UrlMappingUncheckedUpdateInput>
    /**
     * Choose, which UrlMapping to update.
     */
    where: UrlMappingWhereUniqueInput
  }

  /**
   * UrlMapping updateMany
   */
  export type UrlMappingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UrlMappings.
     */
    data: XOR<UrlMappingUpdateManyMutationInput, UrlMappingUncheckedUpdateManyInput>
    /**
     * Filter which UrlMappings to update
     */
    where?: UrlMappingWhereInput
    /**
     * Limit how many UrlMappings to update.
     */
    limit?: number
  }

  /**
   * UrlMapping updateManyAndReturn
   */
  export type UrlMappingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrlMapping
     */
    select?: UrlMappingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UrlMapping
     */
    omit?: UrlMappingOmit<ExtArgs> | null
    /**
     * The data used to update UrlMappings.
     */
    data: XOR<UrlMappingUpdateManyMutationInput, UrlMappingUncheckedUpdateManyInput>
    /**
     * Filter which UrlMappings to update
     */
    where?: UrlMappingWhereInput
    /**
     * Limit how many UrlMappings to update.
     */
    limit?: number
  }

  /**
   * UrlMapping upsert
   */
  export type UrlMappingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrlMapping
     */
    select?: UrlMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UrlMapping
     */
    omit?: UrlMappingOmit<ExtArgs> | null
    /**
     * The filter to search for the UrlMapping to update in case it exists.
     */
    where: UrlMappingWhereUniqueInput
    /**
     * In case the UrlMapping found by the `where` argument doesn't exist, create a new UrlMapping with this data.
     */
    create: XOR<UrlMappingCreateInput, UrlMappingUncheckedCreateInput>
    /**
     * In case the UrlMapping was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UrlMappingUpdateInput, UrlMappingUncheckedUpdateInput>
  }

  /**
   * UrlMapping delete
   */
  export type UrlMappingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrlMapping
     */
    select?: UrlMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UrlMapping
     */
    omit?: UrlMappingOmit<ExtArgs> | null
    /**
     * Filter which UrlMapping to delete.
     */
    where: UrlMappingWhereUniqueInput
  }

  /**
   * UrlMapping deleteMany
   */
  export type UrlMappingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UrlMappings to delete
     */
    where?: UrlMappingWhereInput
    /**
     * Limit how many UrlMappings to delete.
     */
    limit?: number
  }

  /**
   * UrlMapping without action
   */
  export type UrlMappingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UrlMapping
     */
    select?: UrlMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UrlMapping
     */
    omit?: UrlMappingOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const WebhookRequestScalarFieldEnum: {
    id: 'id',
    method: 'method',
    url: 'url',
    headers: 'headers',
    body: 'body',
    queryParams: 'queryParams',
    timestamp: 'timestamp',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent'
  };

  export type WebhookRequestScalarFieldEnum = (typeof WebhookRequestScalarFieldEnum)[keyof typeof WebhookRequestScalarFieldEnum]


  export const UrlMappingScalarFieldEnum: {
    id: 'id',
    webhookPath: 'webhookPath',
    targetUrl: 'targetUrl',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UrlMappingScalarFieldEnum = (typeof UrlMappingScalarFieldEnum)[keyof typeof UrlMappingScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type WebhookRequestWhereInput = {
    AND?: WebhookRequestWhereInput | WebhookRequestWhereInput[]
    OR?: WebhookRequestWhereInput[]
    NOT?: WebhookRequestWhereInput | WebhookRequestWhereInput[]
    id?: IntFilter<"WebhookRequest"> | number
    method?: StringFilter<"WebhookRequest"> | string
    url?: StringFilter<"WebhookRequest"> | string
    headers?: StringNullableFilter<"WebhookRequest"> | string | null
    body?: StringNullableFilter<"WebhookRequest"> | string | null
    queryParams?: StringNullableFilter<"WebhookRequest"> | string | null
    timestamp?: DateTimeFilter<"WebhookRequest"> | Date | string
    ipAddress?: StringNullableFilter<"WebhookRequest"> | string | null
    userAgent?: StringNullableFilter<"WebhookRequest"> | string | null
  }

  export type WebhookRequestOrderByWithRelationInput = {
    id?: SortOrder
    method?: SortOrder
    url?: SortOrder
    headers?: SortOrderInput | SortOrder
    body?: SortOrderInput | SortOrder
    queryParams?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
  }

  export type WebhookRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: WebhookRequestWhereInput | WebhookRequestWhereInput[]
    OR?: WebhookRequestWhereInput[]
    NOT?: WebhookRequestWhereInput | WebhookRequestWhereInput[]
    method?: StringFilter<"WebhookRequest"> | string
    url?: StringFilter<"WebhookRequest"> | string
    headers?: StringNullableFilter<"WebhookRequest"> | string | null
    body?: StringNullableFilter<"WebhookRequest"> | string | null
    queryParams?: StringNullableFilter<"WebhookRequest"> | string | null
    timestamp?: DateTimeFilter<"WebhookRequest"> | Date | string
    ipAddress?: StringNullableFilter<"WebhookRequest"> | string | null
    userAgent?: StringNullableFilter<"WebhookRequest"> | string | null
  }, "id">

  export type WebhookRequestOrderByWithAggregationInput = {
    id?: SortOrder
    method?: SortOrder
    url?: SortOrder
    headers?: SortOrderInput | SortOrder
    body?: SortOrderInput | SortOrder
    queryParams?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    _count?: WebhookRequestCountOrderByAggregateInput
    _avg?: WebhookRequestAvgOrderByAggregateInput
    _max?: WebhookRequestMaxOrderByAggregateInput
    _min?: WebhookRequestMinOrderByAggregateInput
    _sum?: WebhookRequestSumOrderByAggregateInput
  }

  export type WebhookRequestScalarWhereWithAggregatesInput = {
    AND?: WebhookRequestScalarWhereWithAggregatesInput | WebhookRequestScalarWhereWithAggregatesInput[]
    OR?: WebhookRequestScalarWhereWithAggregatesInput[]
    NOT?: WebhookRequestScalarWhereWithAggregatesInput | WebhookRequestScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"WebhookRequest"> | number
    method?: StringWithAggregatesFilter<"WebhookRequest"> | string
    url?: StringWithAggregatesFilter<"WebhookRequest"> | string
    headers?: StringNullableWithAggregatesFilter<"WebhookRequest"> | string | null
    body?: StringNullableWithAggregatesFilter<"WebhookRequest"> | string | null
    queryParams?: StringNullableWithAggregatesFilter<"WebhookRequest"> | string | null
    timestamp?: DateTimeWithAggregatesFilter<"WebhookRequest"> | Date | string
    ipAddress?: StringNullableWithAggregatesFilter<"WebhookRequest"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"WebhookRequest"> | string | null
  }

  export type UrlMappingWhereInput = {
    AND?: UrlMappingWhereInput | UrlMappingWhereInput[]
    OR?: UrlMappingWhereInput[]
    NOT?: UrlMappingWhereInput | UrlMappingWhereInput[]
    id?: IntFilter<"UrlMapping"> | number
    webhookPath?: StringFilter<"UrlMapping"> | string
    targetUrl?: StringFilter<"UrlMapping"> | string
    active?: BoolFilter<"UrlMapping"> | boolean
    createdAt?: DateTimeFilter<"UrlMapping"> | Date | string
    updatedAt?: DateTimeFilter<"UrlMapping"> | Date | string
  }

  export type UrlMappingOrderByWithRelationInput = {
    id?: SortOrder
    webhookPath?: SortOrder
    targetUrl?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UrlMappingWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    webhookPath?: string
    AND?: UrlMappingWhereInput | UrlMappingWhereInput[]
    OR?: UrlMappingWhereInput[]
    NOT?: UrlMappingWhereInput | UrlMappingWhereInput[]
    targetUrl?: StringFilter<"UrlMapping"> | string
    active?: BoolFilter<"UrlMapping"> | boolean
    createdAt?: DateTimeFilter<"UrlMapping"> | Date | string
    updatedAt?: DateTimeFilter<"UrlMapping"> | Date | string
  }, "id" | "webhookPath">

  export type UrlMappingOrderByWithAggregationInput = {
    id?: SortOrder
    webhookPath?: SortOrder
    targetUrl?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UrlMappingCountOrderByAggregateInput
    _avg?: UrlMappingAvgOrderByAggregateInput
    _max?: UrlMappingMaxOrderByAggregateInput
    _min?: UrlMappingMinOrderByAggregateInput
    _sum?: UrlMappingSumOrderByAggregateInput
  }

  export type UrlMappingScalarWhereWithAggregatesInput = {
    AND?: UrlMappingScalarWhereWithAggregatesInput | UrlMappingScalarWhereWithAggregatesInput[]
    OR?: UrlMappingScalarWhereWithAggregatesInput[]
    NOT?: UrlMappingScalarWhereWithAggregatesInput | UrlMappingScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"UrlMapping"> | number
    webhookPath?: StringWithAggregatesFilter<"UrlMapping"> | string
    targetUrl?: StringWithAggregatesFilter<"UrlMapping"> | string
    active?: BoolWithAggregatesFilter<"UrlMapping"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"UrlMapping"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UrlMapping"> | Date | string
  }

  export type WebhookRequestCreateInput = {
    method: string
    url: string
    headers?: string | null
    body?: string | null
    queryParams?: string | null
    timestamp?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type WebhookRequestUncheckedCreateInput = {
    id?: number
    method: string
    url: string
    headers?: string | null
    body?: string | null
    queryParams?: string | null
    timestamp?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type WebhookRequestUpdateInput = {
    method?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    headers?: NullableStringFieldUpdateOperationsInput | string | null
    body?: NullableStringFieldUpdateOperationsInput | string | null
    queryParams?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WebhookRequestUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    method?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    headers?: NullableStringFieldUpdateOperationsInput | string | null
    body?: NullableStringFieldUpdateOperationsInput | string | null
    queryParams?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WebhookRequestCreateManyInput = {
    id?: number
    method: string
    url: string
    headers?: string | null
    body?: string | null
    queryParams?: string | null
    timestamp?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type WebhookRequestUpdateManyMutationInput = {
    method?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    headers?: NullableStringFieldUpdateOperationsInput | string | null
    body?: NullableStringFieldUpdateOperationsInput | string | null
    queryParams?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WebhookRequestUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    method?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    headers?: NullableStringFieldUpdateOperationsInput | string | null
    body?: NullableStringFieldUpdateOperationsInput | string | null
    queryParams?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UrlMappingCreateInput = {
    webhookPath: string
    targetUrl: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UrlMappingUncheckedCreateInput = {
    id?: number
    webhookPath: string
    targetUrl: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UrlMappingUpdateInput = {
    webhookPath?: StringFieldUpdateOperationsInput | string
    targetUrl?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UrlMappingUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    webhookPath?: StringFieldUpdateOperationsInput | string
    targetUrl?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UrlMappingCreateManyInput = {
    id?: number
    webhookPath: string
    targetUrl: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UrlMappingUpdateManyMutationInput = {
    webhookPath?: StringFieldUpdateOperationsInput | string
    targetUrl?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UrlMappingUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    webhookPath?: StringFieldUpdateOperationsInput | string
    targetUrl?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type WebhookRequestCountOrderByAggregateInput = {
    id?: SortOrder
    method?: SortOrder
    url?: SortOrder
    headers?: SortOrder
    body?: SortOrder
    queryParams?: SortOrder
    timestamp?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
  }

  export type WebhookRequestAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type WebhookRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    method?: SortOrder
    url?: SortOrder
    headers?: SortOrder
    body?: SortOrder
    queryParams?: SortOrder
    timestamp?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
  }

  export type WebhookRequestMinOrderByAggregateInput = {
    id?: SortOrder
    method?: SortOrder
    url?: SortOrder
    headers?: SortOrder
    body?: SortOrder
    queryParams?: SortOrder
    timestamp?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
  }

  export type WebhookRequestSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UrlMappingCountOrderByAggregateInput = {
    id?: SortOrder
    webhookPath?: SortOrder
    targetUrl?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UrlMappingAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UrlMappingMaxOrderByAggregateInput = {
    id?: SortOrder
    webhookPath?: SortOrder
    targetUrl?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UrlMappingMinOrderByAggregateInput = {
    id?: SortOrder
    webhookPath?: SortOrder
    targetUrl?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UrlMappingSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}