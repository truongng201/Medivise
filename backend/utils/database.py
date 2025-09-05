import os
from psycopg2 import pool
from .logger import logger


class Database:
    def __init__(self):
        # Build connection config
        self.config = {
            "user": os.getenv("POSTGRES_USER", "postgres"),
            "password": os.getenv("POSTGRES_PASSWORD", "postgres"),
            "host": os.getenv("POSTGRES_HOST", "database"),
            "database": os.getenv("POSTGRES_DB", "test_db"),
            "port": int(os.getenv("POSTGRES_PORT", 5432)),
        }

        pool_min = int(os.getenv("POSTGRES_POOL_MIN", 1))
        pool_max = int(os.getenv("POSTGRES_POOL_MAX", 10))

        try:
            self.pool = pool.SimpleConnectionPool(
                minconn=pool_min,
                maxconn=pool_max,
                **self.config,
            )
            if self.pool:
                logger.info("PostgreSQL connection pool created successfully.")
        except Exception as err:
            logger.error(f"Error creating PostgreSQL connection pool: {err}")
            raise Exception("Failed to create connection pool")

    def execute_query(self, query, params=None):
        """
        Execute a SELECT query using a connection from the pool.
        :param query: SQL query to execute.
        :param params: Parameters for the query (optional).
        :return: Query result.
        """
        connection = None
        cursor = None
        try:
            connection = self.pool.getconn()
            cursor = connection.cursor()
            connection.autocommit = False

            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)

            result = cursor.fetchall()
            connection.commit()
            return result
        except Exception as err:
            logger.error(f"Query execution error: {err}")
            if connection:
                connection.rollback()
            raise
        finally:
            if cursor:
                cursor.close()
            if connection:
                self.pool.putconn(connection)

    def execute_non_query(self, query, params=None):
        """
        Execute an INSERT/UPDATE/DELETE query.
        Returns number of affected rows.
        """
        connection = None
        cursor = None
        try:
            connection = self.pool.getconn()
            cursor = connection.cursor()
            connection.autocommit = False

            cursor.execute(query, params)
            affected = cursor.rowcount
            connection.commit()
            return affected
        except Exception as err:
            logger.error(f"Non-query execution error: {err}")
            if connection:
                connection.rollback()
            raise
        finally:
            if cursor:
                cursor.close()
            if connection:
                self.pool.putconn(connection)

    def close_pool(self):
        """
        Close all connections in the pool.
        """
        try:
            if self.pool:
                self.pool.closeall()
                logger.info("PostgreSQL connection pool closed successfully.")
        except Exception as e:
            logger.error(f"Error closing connection pool: {e}")
            raise Exception("Something went wrong")
