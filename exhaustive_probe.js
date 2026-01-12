import pg from 'pg';
const { Client } = pg;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const regions = ['eu-central-1', 'eu-west-1', 'us-east-1', 'us-west-2'];
const projectRef = 'xkdwmppsvygzujndpjca';
const password = 'Buraz280325';

async function probe() {
    for (const reg of regions) {
        const host = `aws-0-${reg}.pooler.supabase.com`;
        // Formats: Standard (dot), Legacy (simple), Semicolon
        const variations = [
            { name: 'Standard', user: `postgres.${projectRef}` },
            { name: 'Simple', user: 'postgres' }
        ];

        for (const v of variations) {
            for (const port of [5432, 6543]) {
                const connectionString = `postgresql://${v.user}:${password}@${host}:${port}/postgres?sslmode=require`;
                console.log(`Probing ${reg}:${port} [${v.name}]...`);
                const client = new Client({
                    connectionString,
                    connectionTimeoutMillis: 5000,
                    ssl: { rejectUnauthorized: false }
                });
                try {
                    await client.connect();
                    console.log(`SUCCESS! Connected to ${reg}:${port} with ${v.name}`);
                    await client.end();
                    process.exit(0);
                } catch (err) {
                    console.log(`FAILED ${reg}:${port} [${v.name}]: ${err.message}`);
                }
            }
        }
    }
}

probe();
