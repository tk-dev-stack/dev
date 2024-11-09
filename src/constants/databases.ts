export enum DatabaseType {
  MYSQL = "mysql",
  POSTGRESQL = "pg",
  SQLITE = "sqlite3",
  ORACLE = "oracledb",
  MSSQL = "mssql",
  MARIADB = "mariadb",
  COCKROACHDB = "cockroachdb",
}

export const DATABASE_OPTIONS = Object.entries(DatabaseType).map(
  ([key, value]) => ({
    value,
    label: key,
  })
);
