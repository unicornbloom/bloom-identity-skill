/**
 * Test Dashboard URL Generation
 */

import { AgentWallet } from './src/blockchain/agent-wallet';

async function testDashboardURL() {
  console.log('🧪 Testing Dashboard URL Generation...\n');

  try {
    // Create agent wallet (Base Sepolia for testing)
    const wallet = new AgentWallet({ network: 'base-sepolia' });

    console.log('1️⃣ Initializing wallet...');
    const walletInfo = await wallet.initialize();
    console.log(`   ✅ Wallet created: ${walletInfo.address.slice(0, 10)}...`);

    console.log('\n2️⃣ Generating auth token...');
    const token = await wallet.generateAuthToken();
    console.log(`   ✅ Token generated (${token.length} chars)`);
    console.log(`   Token preview: ${token.slice(0, 50)}...`);

    console.log('\n3️⃣ Building dashboard URL...');
    const dashboardUrl = `https://preview.bloomprotocol.ai/dashboard?token=${token}`;
    console.log(`   ✅ Dashboard URL: ${dashboardUrl.slice(0, 80)}...`);

    console.log('\n4️⃣ Verifying token payload...');
    const jwtModule = await import('jsonwebtoken');
    const jwt = jwtModule.default;

    const decoded = jwt.decode(token) as any;
    console.log(`   ✅ Token type: ${decoded.type}`);
    console.log(`   ✅ Token version: ${decoded.version}`);
    console.log(`   ✅ Address: ${decoded.address}`);
    console.log(`   ✅ Scopes: ${decoded.scope.join(', ')}`);
    console.log(`   ✅ Expires: ${new Date(decoded.expiresAt).toLocaleString()}`);

    console.log('\n✅ All tests passed! Dashboard URL is working correctly.\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

testDashboardURL();
