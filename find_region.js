import pg from 'pg';
const { Client } = pg;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const regions = [
    'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3',
    'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
    'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2',
    'ap-south-1', 'sa-east-1', 'ca-central-1', 'me-central-1', 'af-south-1'
];
const projectRef = 'xkdwmppsvygzujndpjca';
const password = 'Burez280325';

async function probe() {
    for (const reg of regions) {
        const host = `aws-0-${reg}.pooler.supabase.com`;
        // We try port 5432 (Session) as it's often more stable for discovery
        const connectionString = `postgresql://postgres.${projectRef}:${password}@${host}:5432/postgres?sslmode=require`;
        console.log(`Probing ${reg}...`);
        const client = new Client({
            connectionString,
            connectionTimeoutMillis: 5000,
            ssl: { rejectUnauthorized: false }
        });
        try {
            await client.connect();
            console.log(`SUCCESS! Project is in ${reg}`);
            await client.end();
            process.exit(0);
        } catch (err) {
            console.log(`${reg}: ${err.message}`);
        }
    }
}

probe();
