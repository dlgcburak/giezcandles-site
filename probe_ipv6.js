import pg from 'pg';
const { Client } = pg;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function probe() {
    console.log(`Probing direct IPv6...`);
    const client = new Client({
        host: '2a05:d018:135e:161b:c797:af30:930:faf5',
        port: 5432,
        user: 'postgres',
        password: 'Burez280325',
        database: 'postgres',
        ssl: { rejectUnauthorized: false }
    });
    try {
        await client.connect();
        console.log(`SUCCESS! Connected directly via IPv6`);
        await client.end();
        process.exit(0);
    } catch (err) {
        console.log(`FAILED direct IPv6: ${err.message}`);
        process.exit(1);
    }
}

probe();
