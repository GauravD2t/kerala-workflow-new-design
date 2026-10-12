module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'postgres',
        host: env('DATABASE_HOST', '127.0.0.1'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'kerala_workflow'),
        username: env('DATABASE_USERNAME', 'dspace'),
        password: env('DATABASE_PASSWORD', 'dspace'),
        ssl: env.bool('DATABASE_SSL', false),
        pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 80) },
      },
      options: {}
    },
  },
});
