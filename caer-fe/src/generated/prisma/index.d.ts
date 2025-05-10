
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
 * Model LP_Factory
 * 
 */
export type LP_Factory = $Result.DefaultSelection<Prisma.$LP_FactoryPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more LP_Factories
 * const lP_Factories = await prisma.lP_Factory.findMany()
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
   * // Fetch zero or more LP_Factories
   * const lP_Factories = await prisma.lP_Factory.findMany()
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
   * `prisma.lP_Factory`: Exposes CRUD operations for the **LP_Factory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LP_Factories
    * const lP_Factories = await prisma.lP_Factory.findMany()
    * ```
    */
  get lP_Factory(): Prisma.LP_FactoryDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
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
    LP_Factory: 'LP_Factory'
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
      modelProps: "lP_Factory"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      LP_Factory: {
        payload: Prisma.$LP_FactoryPayload<ExtArgs>
        fields: Prisma.LP_FactoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LP_FactoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LP_FactoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LP_FactoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LP_FactoryPayload>
          }
          findFirst: {
            args: Prisma.LP_FactoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LP_FactoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LP_FactoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LP_FactoryPayload>
          }
          findMany: {
            args: Prisma.LP_FactoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LP_FactoryPayload>[]
          }
          create: {
            args: Prisma.LP_FactoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LP_FactoryPayload>
          }
          createMany: {
            args: Prisma.LP_FactoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LP_FactoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LP_FactoryPayload>[]
          }
          delete: {
            args: Prisma.LP_FactoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LP_FactoryPayload>
          }
          update: {
            args: Prisma.LP_FactoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LP_FactoryPayload>
          }
          deleteMany: {
            args: Prisma.LP_FactoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LP_FactoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LP_FactoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LP_FactoryPayload>[]
          }
          upsert: {
            args: Prisma.LP_FactoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LP_FactoryPayload>
          }
          aggregate: {
            args: Prisma.LP_FactoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLP_Factory>
          }
          groupBy: {
            args: Prisma.LP_FactoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<LP_FactoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.LP_FactoryCountArgs<ExtArgs>
            result: $Utils.Optional<LP_FactoryCountAggregateOutputType> | number
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
    lP_Factory?: LP_FactoryOmit
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
   * Model LP_Factory
   */

  export type AggregateLP_Factory = {
    _count: LP_FactoryCountAggregateOutputType | null
    _min: LP_FactoryMinAggregateOutputType | null
    _max: LP_FactoryMaxAggregateOutputType | null
  }

  export type LP_FactoryMinAggregateOutputType = {
    id: string | null
    sender: string | null
    collateralToken: string | null
    borrowToken: string | null
    ltv: string | null
    poolIndex: string | null
    lpAddress: string | null
    createdAt: Date | null
  }

  export type LP_FactoryMaxAggregateOutputType = {
    id: string | null
    sender: string | null
    collateralToken: string | null
    borrowToken: string | null
    ltv: string | null
    poolIndex: string | null
    lpAddress: string | null
    createdAt: Date | null
  }

  export type LP_FactoryCountAggregateOutputType = {
    id: number
    sender: number
    collateralToken: number
    borrowToken: number
    ltv: number
    poolIndex: number
    lpAddress: number
    createdAt: number
    _all: number
  }


  export type LP_FactoryMinAggregateInputType = {
    id?: true
    sender?: true
    collateralToken?: true
    borrowToken?: true
    ltv?: true
    poolIndex?: true
    lpAddress?: true
    createdAt?: true
  }

  export type LP_FactoryMaxAggregateInputType = {
    id?: true
    sender?: true
    collateralToken?: true
    borrowToken?: true
    ltv?: true
    poolIndex?: true
    lpAddress?: true
    createdAt?: true
  }

  export type LP_FactoryCountAggregateInputType = {
    id?: true
    sender?: true
    collateralToken?: true
    borrowToken?: true
    ltv?: true
    poolIndex?: true
    lpAddress?: true
    createdAt?: true
    _all?: true
  }

  export type LP_FactoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LP_Factory to aggregate.
     */
    where?: LP_FactoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LP_Factories to fetch.
     */
    orderBy?: LP_FactoryOrderByWithRelationInput | LP_FactoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LP_FactoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LP_Factories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LP_Factories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LP_Factories
    **/
    _count?: true | LP_FactoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LP_FactoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LP_FactoryMaxAggregateInputType
  }

  export type GetLP_FactoryAggregateType<T extends LP_FactoryAggregateArgs> = {
        [P in keyof T & keyof AggregateLP_Factory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLP_Factory[P]>
      : GetScalarType<T[P], AggregateLP_Factory[P]>
  }




  export type LP_FactoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LP_FactoryWhereInput
    orderBy?: LP_FactoryOrderByWithAggregationInput | LP_FactoryOrderByWithAggregationInput[]
    by: LP_FactoryScalarFieldEnum[] | LP_FactoryScalarFieldEnum
    having?: LP_FactoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LP_FactoryCountAggregateInputType | true
    _min?: LP_FactoryMinAggregateInputType
    _max?: LP_FactoryMaxAggregateInputType
  }

  export type LP_FactoryGroupByOutputType = {
    id: string
    sender: string
    collateralToken: string
    borrowToken: string
    ltv: string
    poolIndex: string
    lpAddress: string
    createdAt: Date
    _count: LP_FactoryCountAggregateOutputType | null
    _min: LP_FactoryMinAggregateOutputType | null
    _max: LP_FactoryMaxAggregateOutputType | null
  }

  type GetLP_FactoryGroupByPayload<T extends LP_FactoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LP_FactoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LP_FactoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LP_FactoryGroupByOutputType[P]>
            : GetScalarType<T[P], LP_FactoryGroupByOutputType[P]>
        }
      >
    >


  export type LP_FactorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sender?: boolean
    collateralToken?: boolean
    borrowToken?: boolean
    ltv?: boolean
    poolIndex?: boolean
    lpAddress?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["lP_Factory"]>

  export type LP_FactorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sender?: boolean
    collateralToken?: boolean
    borrowToken?: boolean
    ltv?: boolean
    poolIndex?: boolean
    lpAddress?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["lP_Factory"]>

  export type LP_FactorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sender?: boolean
    collateralToken?: boolean
    borrowToken?: boolean
    ltv?: boolean
    poolIndex?: boolean
    lpAddress?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["lP_Factory"]>

  export type LP_FactorySelectScalar = {
    id?: boolean
    sender?: boolean
    collateralToken?: boolean
    borrowToken?: boolean
    ltv?: boolean
    poolIndex?: boolean
    lpAddress?: boolean
    createdAt?: boolean
  }

  export type LP_FactoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sender" | "collateralToken" | "borrowToken" | "ltv" | "poolIndex" | "lpAddress" | "createdAt", ExtArgs["result"]["lP_Factory"]>

  export type $LP_FactoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LP_Factory"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sender: string
      collateralToken: string
      borrowToken: string
      ltv: string
      poolIndex: string
      lpAddress: string
      createdAt: Date
    }, ExtArgs["result"]["lP_Factory"]>
    composites: {}
  }

  type LP_FactoryGetPayload<S extends boolean | null | undefined | LP_FactoryDefaultArgs> = $Result.GetResult<Prisma.$LP_FactoryPayload, S>

  type LP_FactoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LP_FactoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LP_FactoryCountAggregateInputType | true
    }

  export interface LP_FactoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LP_Factory'], meta: { name: 'LP_Factory' } }
    /**
     * Find zero or one LP_Factory that matches the filter.
     * @param {LP_FactoryFindUniqueArgs} args - Arguments to find a LP_Factory
     * @example
     * // Get one LP_Factory
     * const lP_Factory = await prisma.lP_Factory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LP_FactoryFindUniqueArgs>(args: SelectSubset<T, LP_FactoryFindUniqueArgs<ExtArgs>>): Prisma__LP_FactoryClient<$Result.GetResult<Prisma.$LP_FactoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LP_Factory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LP_FactoryFindUniqueOrThrowArgs} args - Arguments to find a LP_Factory
     * @example
     * // Get one LP_Factory
     * const lP_Factory = await prisma.lP_Factory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LP_FactoryFindUniqueOrThrowArgs>(args: SelectSubset<T, LP_FactoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LP_FactoryClient<$Result.GetResult<Prisma.$LP_FactoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LP_Factory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LP_FactoryFindFirstArgs} args - Arguments to find a LP_Factory
     * @example
     * // Get one LP_Factory
     * const lP_Factory = await prisma.lP_Factory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LP_FactoryFindFirstArgs>(args?: SelectSubset<T, LP_FactoryFindFirstArgs<ExtArgs>>): Prisma__LP_FactoryClient<$Result.GetResult<Prisma.$LP_FactoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LP_Factory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LP_FactoryFindFirstOrThrowArgs} args - Arguments to find a LP_Factory
     * @example
     * // Get one LP_Factory
     * const lP_Factory = await prisma.lP_Factory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LP_FactoryFindFirstOrThrowArgs>(args?: SelectSubset<T, LP_FactoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__LP_FactoryClient<$Result.GetResult<Prisma.$LP_FactoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LP_Factories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LP_FactoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LP_Factories
     * const lP_Factories = await prisma.lP_Factory.findMany()
     * 
     * // Get first 10 LP_Factories
     * const lP_Factories = await prisma.lP_Factory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lP_FactoryWithIdOnly = await prisma.lP_Factory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LP_FactoryFindManyArgs>(args?: SelectSubset<T, LP_FactoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LP_FactoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LP_Factory.
     * @param {LP_FactoryCreateArgs} args - Arguments to create a LP_Factory.
     * @example
     * // Create one LP_Factory
     * const LP_Factory = await prisma.lP_Factory.create({
     *   data: {
     *     // ... data to create a LP_Factory
     *   }
     * })
     * 
     */
    create<T extends LP_FactoryCreateArgs>(args: SelectSubset<T, LP_FactoryCreateArgs<ExtArgs>>): Prisma__LP_FactoryClient<$Result.GetResult<Prisma.$LP_FactoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LP_Factories.
     * @param {LP_FactoryCreateManyArgs} args - Arguments to create many LP_Factories.
     * @example
     * // Create many LP_Factories
     * const lP_Factory = await prisma.lP_Factory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LP_FactoryCreateManyArgs>(args?: SelectSubset<T, LP_FactoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LP_Factories and returns the data saved in the database.
     * @param {LP_FactoryCreateManyAndReturnArgs} args - Arguments to create many LP_Factories.
     * @example
     * // Create many LP_Factories
     * const lP_Factory = await prisma.lP_Factory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LP_Factories and only return the `id`
     * const lP_FactoryWithIdOnly = await prisma.lP_Factory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LP_FactoryCreateManyAndReturnArgs>(args?: SelectSubset<T, LP_FactoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LP_FactoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LP_Factory.
     * @param {LP_FactoryDeleteArgs} args - Arguments to delete one LP_Factory.
     * @example
     * // Delete one LP_Factory
     * const LP_Factory = await prisma.lP_Factory.delete({
     *   where: {
     *     // ... filter to delete one LP_Factory
     *   }
     * })
     * 
     */
    delete<T extends LP_FactoryDeleteArgs>(args: SelectSubset<T, LP_FactoryDeleteArgs<ExtArgs>>): Prisma__LP_FactoryClient<$Result.GetResult<Prisma.$LP_FactoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LP_Factory.
     * @param {LP_FactoryUpdateArgs} args - Arguments to update one LP_Factory.
     * @example
     * // Update one LP_Factory
     * const lP_Factory = await prisma.lP_Factory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LP_FactoryUpdateArgs>(args: SelectSubset<T, LP_FactoryUpdateArgs<ExtArgs>>): Prisma__LP_FactoryClient<$Result.GetResult<Prisma.$LP_FactoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LP_Factories.
     * @param {LP_FactoryDeleteManyArgs} args - Arguments to filter LP_Factories to delete.
     * @example
     * // Delete a few LP_Factories
     * const { count } = await prisma.lP_Factory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LP_FactoryDeleteManyArgs>(args?: SelectSubset<T, LP_FactoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LP_Factories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LP_FactoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LP_Factories
     * const lP_Factory = await prisma.lP_Factory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LP_FactoryUpdateManyArgs>(args: SelectSubset<T, LP_FactoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LP_Factories and returns the data updated in the database.
     * @param {LP_FactoryUpdateManyAndReturnArgs} args - Arguments to update many LP_Factories.
     * @example
     * // Update many LP_Factories
     * const lP_Factory = await prisma.lP_Factory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LP_Factories and only return the `id`
     * const lP_FactoryWithIdOnly = await prisma.lP_Factory.updateManyAndReturn({
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
    updateManyAndReturn<T extends LP_FactoryUpdateManyAndReturnArgs>(args: SelectSubset<T, LP_FactoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LP_FactoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LP_Factory.
     * @param {LP_FactoryUpsertArgs} args - Arguments to update or create a LP_Factory.
     * @example
     * // Update or create a LP_Factory
     * const lP_Factory = await prisma.lP_Factory.upsert({
     *   create: {
     *     // ... data to create a LP_Factory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LP_Factory we want to update
     *   }
     * })
     */
    upsert<T extends LP_FactoryUpsertArgs>(args: SelectSubset<T, LP_FactoryUpsertArgs<ExtArgs>>): Prisma__LP_FactoryClient<$Result.GetResult<Prisma.$LP_FactoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LP_Factories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LP_FactoryCountArgs} args - Arguments to filter LP_Factories to count.
     * @example
     * // Count the number of LP_Factories
     * const count = await prisma.lP_Factory.count({
     *   where: {
     *     // ... the filter for the LP_Factories we want to count
     *   }
     * })
    **/
    count<T extends LP_FactoryCountArgs>(
      args?: Subset<T, LP_FactoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LP_FactoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LP_Factory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LP_FactoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LP_FactoryAggregateArgs>(args: Subset<T, LP_FactoryAggregateArgs>): Prisma.PrismaPromise<GetLP_FactoryAggregateType<T>>

    /**
     * Group by LP_Factory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LP_FactoryGroupByArgs} args - Group by arguments.
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
      T extends LP_FactoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LP_FactoryGroupByArgs['orderBy'] }
        : { orderBy?: LP_FactoryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LP_FactoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLP_FactoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LP_Factory model
   */
  readonly fields: LP_FactoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LP_Factory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LP_FactoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the LP_Factory model
   */
  interface LP_FactoryFieldRefs {
    readonly id: FieldRef<"LP_Factory", 'String'>
    readonly sender: FieldRef<"LP_Factory", 'String'>
    readonly collateralToken: FieldRef<"LP_Factory", 'String'>
    readonly borrowToken: FieldRef<"LP_Factory", 'String'>
    readonly ltv: FieldRef<"LP_Factory", 'String'>
    readonly poolIndex: FieldRef<"LP_Factory", 'String'>
    readonly lpAddress: FieldRef<"LP_Factory", 'String'>
    readonly createdAt: FieldRef<"LP_Factory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LP_Factory findUnique
   */
  export type LP_FactoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LP_Factory
     */
    select?: LP_FactorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LP_Factory
     */
    omit?: LP_FactoryOmit<ExtArgs> | null
    /**
     * Filter, which LP_Factory to fetch.
     */
    where: LP_FactoryWhereUniqueInput
  }

  /**
   * LP_Factory findUniqueOrThrow
   */
  export type LP_FactoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LP_Factory
     */
    select?: LP_FactorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LP_Factory
     */
    omit?: LP_FactoryOmit<ExtArgs> | null
    /**
     * Filter, which LP_Factory to fetch.
     */
    where: LP_FactoryWhereUniqueInput
  }

  /**
   * LP_Factory findFirst
   */
  export type LP_FactoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LP_Factory
     */
    select?: LP_FactorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LP_Factory
     */
    omit?: LP_FactoryOmit<ExtArgs> | null
    /**
     * Filter, which LP_Factory to fetch.
     */
    where?: LP_FactoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LP_Factories to fetch.
     */
    orderBy?: LP_FactoryOrderByWithRelationInput | LP_FactoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LP_Factories.
     */
    cursor?: LP_FactoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LP_Factories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LP_Factories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LP_Factories.
     */
    distinct?: LP_FactoryScalarFieldEnum | LP_FactoryScalarFieldEnum[]
  }

  /**
   * LP_Factory findFirstOrThrow
   */
  export type LP_FactoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LP_Factory
     */
    select?: LP_FactorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LP_Factory
     */
    omit?: LP_FactoryOmit<ExtArgs> | null
    /**
     * Filter, which LP_Factory to fetch.
     */
    where?: LP_FactoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LP_Factories to fetch.
     */
    orderBy?: LP_FactoryOrderByWithRelationInput | LP_FactoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LP_Factories.
     */
    cursor?: LP_FactoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LP_Factories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LP_Factories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LP_Factories.
     */
    distinct?: LP_FactoryScalarFieldEnum | LP_FactoryScalarFieldEnum[]
  }

  /**
   * LP_Factory findMany
   */
  export type LP_FactoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LP_Factory
     */
    select?: LP_FactorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LP_Factory
     */
    omit?: LP_FactoryOmit<ExtArgs> | null
    /**
     * Filter, which LP_Factories to fetch.
     */
    where?: LP_FactoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LP_Factories to fetch.
     */
    orderBy?: LP_FactoryOrderByWithRelationInput | LP_FactoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LP_Factories.
     */
    cursor?: LP_FactoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LP_Factories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LP_Factories.
     */
    skip?: number
    distinct?: LP_FactoryScalarFieldEnum | LP_FactoryScalarFieldEnum[]
  }

  /**
   * LP_Factory create
   */
  export type LP_FactoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LP_Factory
     */
    select?: LP_FactorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LP_Factory
     */
    omit?: LP_FactoryOmit<ExtArgs> | null
    /**
     * The data needed to create a LP_Factory.
     */
    data: XOR<LP_FactoryCreateInput, LP_FactoryUncheckedCreateInput>
  }

  /**
   * LP_Factory createMany
   */
  export type LP_FactoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LP_Factories.
     */
    data: LP_FactoryCreateManyInput | LP_FactoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LP_Factory createManyAndReturn
   */
  export type LP_FactoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LP_Factory
     */
    select?: LP_FactorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LP_Factory
     */
    omit?: LP_FactoryOmit<ExtArgs> | null
    /**
     * The data used to create many LP_Factories.
     */
    data: LP_FactoryCreateManyInput | LP_FactoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LP_Factory update
   */
  export type LP_FactoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LP_Factory
     */
    select?: LP_FactorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LP_Factory
     */
    omit?: LP_FactoryOmit<ExtArgs> | null
    /**
     * The data needed to update a LP_Factory.
     */
    data: XOR<LP_FactoryUpdateInput, LP_FactoryUncheckedUpdateInput>
    /**
     * Choose, which LP_Factory to update.
     */
    where: LP_FactoryWhereUniqueInput
  }

  /**
   * LP_Factory updateMany
   */
  export type LP_FactoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LP_Factories.
     */
    data: XOR<LP_FactoryUpdateManyMutationInput, LP_FactoryUncheckedUpdateManyInput>
    /**
     * Filter which LP_Factories to update
     */
    where?: LP_FactoryWhereInput
    /**
     * Limit how many LP_Factories to update.
     */
    limit?: number
  }

  /**
   * LP_Factory updateManyAndReturn
   */
  export type LP_FactoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LP_Factory
     */
    select?: LP_FactorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LP_Factory
     */
    omit?: LP_FactoryOmit<ExtArgs> | null
    /**
     * The data used to update LP_Factories.
     */
    data: XOR<LP_FactoryUpdateManyMutationInput, LP_FactoryUncheckedUpdateManyInput>
    /**
     * Filter which LP_Factories to update
     */
    where?: LP_FactoryWhereInput
    /**
     * Limit how many LP_Factories to update.
     */
    limit?: number
  }

  /**
   * LP_Factory upsert
   */
  export type LP_FactoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LP_Factory
     */
    select?: LP_FactorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LP_Factory
     */
    omit?: LP_FactoryOmit<ExtArgs> | null
    /**
     * The filter to search for the LP_Factory to update in case it exists.
     */
    where: LP_FactoryWhereUniqueInput
    /**
     * In case the LP_Factory found by the `where` argument doesn't exist, create a new LP_Factory with this data.
     */
    create: XOR<LP_FactoryCreateInput, LP_FactoryUncheckedCreateInput>
    /**
     * In case the LP_Factory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LP_FactoryUpdateInput, LP_FactoryUncheckedUpdateInput>
  }

  /**
   * LP_Factory delete
   */
  export type LP_FactoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LP_Factory
     */
    select?: LP_FactorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LP_Factory
     */
    omit?: LP_FactoryOmit<ExtArgs> | null
    /**
     * Filter which LP_Factory to delete.
     */
    where: LP_FactoryWhereUniqueInput
  }

  /**
   * LP_Factory deleteMany
   */
  export type LP_FactoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LP_Factories to delete
     */
    where?: LP_FactoryWhereInput
    /**
     * Limit how many LP_Factories to delete.
     */
    limit?: number
  }

  /**
   * LP_Factory without action
   */
  export type LP_FactoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LP_Factory
     */
    select?: LP_FactorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LP_Factory
     */
    omit?: LP_FactoryOmit<ExtArgs> | null
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


  export const LP_FactoryScalarFieldEnum: {
    id: 'id',
    sender: 'sender',
    collateralToken: 'collateralToken',
    borrowToken: 'borrowToken',
    ltv: 'ltv',
    poolIndex: 'poolIndex',
    lpAddress: 'lpAddress',
    createdAt: 'createdAt'
  };

  export type LP_FactoryScalarFieldEnum = (typeof LP_FactoryScalarFieldEnum)[keyof typeof LP_FactoryScalarFieldEnum]


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


  /**
   * Field references
   */


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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type LP_FactoryWhereInput = {
    AND?: LP_FactoryWhereInput | LP_FactoryWhereInput[]
    OR?: LP_FactoryWhereInput[]
    NOT?: LP_FactoryWhereInput | LP_FactoryWhereInput[]
    id?: StringFilter<"LP_Factory"> | string
    sender?: StringFilter<"LP_Factory"> | string
    collateralToken?: StringFilter<"LP_Factory"> | string
    borrowToken?: StringFilter<"LP_Factory"> | string
    ltv?: StringFilter<"LP_Factory"> | string
    poolIndex?: StringFilter<"LP_Factory"> | string
    lpAddress?: StringFilter<"LP_Factory"> | string
    createdAt?: DateTimeFilter<"LP_Factory"> | Date | string
  }

  export type LP_FactoryOrderByWithRelationInput = {
    id?: SortOrder
    sender?: SortOrder
    collateralToken?: SortOrder
    borrowToken?: SortOrder
    ltv?: SortOrder
    poolIndex?: SortOrder
    lpAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type LP_FactoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LP_FactoryWhereInput | LP_FactoryWhereInput[]
    OR?: LP_FactoryWhereInput[]
    NOT?: LP_FactoryWhereInput | LP_FactoryWhereInput[]
    sender?: StringFilter<"LP_Factory"> | string
    collateralToken?: StringFilter<"LP_Factory"> | string
    borrowToken?: StringFilter<"LP_Factory"> | string
    ltv?: StringFilter<"LP_Factory"> | string
    poolIndex?: StringFilter<"LP_Factory"> | string
    lpAddress?: StringFilter<"LP_Factory"> | string
    createdAt?: DateTimeFilter<"LP_Factory"> | Date | string
  }, "id">

  export type LP_FactoryOrderByWithAggregationInput = {
    id?: SortOrder
    sender?: SortOrder
    collateralToken?: SortOrder
    borrowToken?: SortOrder
    ltv?: SortOrder
    poolIndex?: SortOrder
    lpAddress?: SortOrder
    createdAt?: SortOrder
    _count?: LP_FactoryCountOrderByAggregateInput
    _max?: LP_FactoryMaxOrderByAggregateInput
    _min?: LP_FactoryMinOrderByAggregateInput
  }

  export type LP_FactoryScalarWhereWithAggregatesInput = {
    AND?: LP_FactoryScalarWhereWithAggregatesInput | LP_FactoryScalarWhereWithAggregatesInput[]
    OR?: LP_FactoryScalarWhereWithAggregatesInput[]
    NOT?: LP_FactoryScalarWhereWithAggregatesInput | LP_FactoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LP_Factory"> | string
    sender?: StringWithAggregatesFilter<"LP_Factory"> | string
    collateralToken?: StringWithAggregatesFilter<"LP_Factory"> | string
    borrowToken?: StringWithAggregatesFilter<"LP_Factory"> | string
    ltv?: StringWithAggregatesFilter<"LP_Factory"> | string
    poolIndex?: StringWithAggregatesFilter<"LP_Factory"> | string
    lpAddress?: StringWithAggregatesFilter<"LP_Factory"> | string
    createdAt?: DateTimeWithAggregatesFilter<"LP_Factory"> | Date | string
  }

  export type LP_FactoryCreateInput = {
    id?: string
    sender: string
    collateralToken: string
    borrowToken: string
    ltv: string
    poolIndex: string
    lpAddress: string
    createdAt?: Date | string
  }

  export type LP_FactoryUncheckedCreateInput = {
    id?: string
    sender: string
    collateralToken: string
    borrowToken: string
    ltv: string
    poolIndex: string
    lpAddress: string
    createdAt?: Date | string
  }

  export type LP_FactoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    collateralToken?: StringFieldUpdateOperationsInput | string
    borrowToken?: StringFieldUpdateOperationsInput | string
    ltv?: StringFieldUpdateOperationsInput | string
    poolIndex?: StringFieldUpdateOperationsInput | string
    lpAddress?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LP_FactoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    collateralToken?: StringFieldUpdateOperationsInput | string
    borrowToken?: StringFieldUpdateOperationsInput | string
    ltv?: StringFieldUpdateOperationsInput | string
    poolIndex?: StringFieldUpdateOperationsInput | string
    lpAddress?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LP_FactoryCreateManyInput = {
    id?: string
    sender: string
    collateralToken: string
    borrowToken: string
    ltv: string
    poolIndex: string
    lpAddress: string
    createdAt?: Date | string
  }

  export type LP_FactoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    collateralToken?: StringFieldUpdateOperationsInput | string
    borrowToken?: StringFieldUpdateOperationsInput | string
    ltv?: StringFieldUpdateOperationsInput | string
    poolIndex?: StringFieldUpdateOperationsInput | string
    lpAddress?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LP_FactoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    collateralToken?: StringFieldUpdateOperationsInput | string
    borrowToken?: StringFieldUpdateOperationsInput | string
    ltv?: StringFieldUpdateOperationsInput | string
    poolIndex?: StringFieldUpdateOperationsInput | string
    lpAddress?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type LP_FactoryCountOrderByAggregateInput = {
    id?: SortOrder
    sender?: SortOrder
    collateralToken?: SortOrder
    borrowToken?: SortOrder
    ltv?: SortOrder
    poolIndex?: SortOrder
    lpAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type LP_FactoryMaxOrderByAggregateInput = {
    id?: SortOrder
    sender?: SortOrder
    collateralToken?: SortOrder
    borrowToken?: SortOrder
    ltv?: SortOrder
    poolIndex?: SortOrder
    lpAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type LP_FactoryMinOrderByAggregateInput = {
    id?: SortOrder
    sender?: SortOrder
    collateralToken?: SortOrder
    borrowToken?: SortOrder
    ltv?: SortOrder
    poolIndex?: SortOrder
    lpAddress?: SortOrder
    createdAt?: SortOrder
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

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
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