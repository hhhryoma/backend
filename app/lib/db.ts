import mysql from 'mysql2/promise';

const poolConfig = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    connectionLimit: 1,
    maxIdle: 1,
    enableKeepAlive: true,
};

let pool: mysql.Pool | null = null;

const getPool = (): mysql.Pool => {
    if (!pool) {
        pool = mysql.createPool(poolConfig)
    }
    return pool
}

export type Query = {
    sql: string
    params: (string | number)[]
}

export async function selectQuery(query: Query) {
    try {
        const [result] = await getPool().query(query.sql, query.params);
        return result
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
}

export async function updateQuery(querys: Query[]) {
    const conn: mysql.PoolConnection = await getPool().getConnection()
    try {
        await conn.beginTransaction();
        querys.forEach(query => {
            console.debug({ query })
            conn.execute(query.sql, query.params)
        });
        await conn.commit()
    } catch (error) {
        console.error(error);
        await conn.rollback();
        return Promise.reject(error);
    } finally {
        if (!conn) {
            getPool().releaseConnection(conn);
        }
    }
}