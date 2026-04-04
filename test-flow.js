const http = require('http');

const API_URL = 'http://localhost:3000';

async function mockPost(endpoint, body) {
    return new Promise((resolve, reject) => {
        const req = http.request(API_URL + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data || '{}')));
        });
        req.on('error', reject);
        req.write(JSON.stringify(body));
        req.end();
    });
}

async function runTest() {
    console.log("🛡️ === SHIELDGRID E2E TEST === 🛡️\n");

    // 1. Onboard Worker
    console.log("1. Onboarding new delivery worker...");
    const user = await mockPost('/users/onboard', {
        fullName: "Rahul M.",
        workerId: "SWG-BLR-8841",
        upiId: "rahul@paytm"
    });
    console.log(`✅ Success! Worker ID in Postgres: ${user.id}\n`);

    // 2. Issue Policy (hits FastAPI)
    console.log("2. Requesting ML Risk Oracle for dynamic premium & issuing policy...");
    const policyResult = await mockPost('/policy/issue', {
        userId: user.id,
        zone: "Koramangala, BLR"
    });
    console.log(`✅ Success! Policy created.`);
    console.log(`   Base Premium: ₹${policyResult.risk_assessment.base_premium}`);
    console.log(`   ML Risk Multiplier: ${policyResult.risk_assessment.risk_multiplier}x`);
    console.log(`   Final Paid: ₹${policyResult.risk_assessment.final_premium}\n`);

    console.log("3. Monitoring environment for Disruption...");
    console.log("⏳ Watch your FastAPI 'uvicorn' terminal logger. The Oracle has a 10% chance every 10 seconds to discover 50mm+ rainfall and trigger a Payout directly back to the NestJS cluster!");
    console.log("(If you get impatient, you can manually trigger it with the curl below!)\n");

    console.log("To force a trigger manually, run this in a terminal:");
    console.log(`Invoke-RestMethod -Uri "http://localhost:3000/payouts/trigger" -Method Post -Body '{"zone": "Koramangala, BLR", "event_type": "RAINFALL", "value": 65}' -ContentType 'application/json'`);

}

runTest().catch(err => console.error("Test failed: Make sure NestJS is running on port 3000!", err.message));
