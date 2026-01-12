import pg from 'pg';
const { Client } = pg;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const regions = ['eu-central-1', 'eu-west-1', 'us-east-1'];
const projectRef = 'xkdwmppsvygzujndpjca';
const password = 'Buraz280325';

async function probe() {
    for (const reg of regions) {
        const host = `aws-0-${reg}.pooler.supabase.com`;
        for (const port of [5432, 6543]) {
            const connectionString = `postgresql://postgres.${projectRef}:${password}@${host}:${port}/postgres?sslmode=require`;
            console.log(`Probing ${reg} on port ${port}...`);
            const client = new Client({
                connectionString,
                connectionTimeoutMillis: 5000,
                ssl: { rejectUnauthorized: false }
            });
            try {
                await client.connect();
                console.log(`SUCCESS! Connected to ${reg} on port ${port}`);
                await client.end();
                process.exit(0);
            } catch (err) {
                console.log(`${reg}:${port} - ${err.message}`);
            }
        }
    }
}

probe();
