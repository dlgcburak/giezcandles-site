import pg from 'pg';
const { Client } = pg;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connectionString = "postgresql://postgres:Buraz280325@db.xkdwmppsvygzujndpjca.supabase.co:5432/postgres?sslmode=require";

async function check() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });
    try {
        await client.connect();
        const users = await client.query('SELECT count(*) FROM users');
        const products = await client.query('SELECT count(*) FROM products');
        const collections = await client.query('SELECT count(*) FROM collections');

        console.log(`Users count: ${users.rows[0].count}`);
        console.log(`Products count: ${products.rows[0].count}`);
        console.log(`Collections count: ${collections.rows[0].count}`);

        await client.end();
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
}

check();
