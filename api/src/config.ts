import * as dotenv from 'dotenv';

dotenv.config();

if (typeof process.env.DATABASE_URL !== 'string') {
    console.error('DATABASE_URL is not specified in environment');
    process.exit();
}

if (typeof process.env.S3_USER !== 'string') {
    console.error('S3_USER is not specified in environment');
    process.exit();
}

if (typeof process.env.S3_PASSWORD !== 'string') {
    console.error('S3_PASSWORD is not specified in environment');
    process.exit();
}

if (typeof process.env.S3_PORT !== 'string') {
    console.error('S3_PORT is not specified in environment');
    process.exit();
}

if (typeof process.env.S3_HOST !== 'string') {
    console.error('S3_HOST is not specified in environment');
    process.exit();
}

if (typeof process.env.QUEUE_URL !== 'string') {
    console.error('QUEUE_URL is not specified in environment');
    process.exit();
}

export const {
    DATABASE_URL,
    S3_USER,
    S3_PASSWORD,
    S3_PORT,
    S3_HOST,
    QUEUE_URL,
} = process.env;
