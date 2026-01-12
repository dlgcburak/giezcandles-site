import pg from 'pg';
const { Client } = pg;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const projectRef = 'xkdwmppsvygzujndpjca';
const password = 'Burez280325';
const host = 'aws-0-eu-central-1.pooler.supabase.com';

const variations = [
    { name: 'Standard', user: `postgres.${projectRef}` },
    { name: 'Legacy', user: 'postgres', pass: `${password};${projectRef}` },
    { name: 'Simple', user: 'postgres' }
];

async function probe() {
    for (const v of variations) {
        console.log(`Probing ${v.name} format...`);
        const user = v.user;
        const pass = v.pass || password;
        const connectionString = `postgresql://${user}:${pass}@${host}:6543/postgres?sslmode=require`;

        const client = new Client({
            connectionString,
            ssl: { rejectUnauthorized: false }
        });
        try {
            await client.connect();
            console.log(`SUCCESS! Connected with ${v.name} format`);
            await client.end();
            process.exit(0);
        } catch (err) {
            console.log(`FAILED ${v.name}: ${err.message}`);
        }
    }
}

probe();
