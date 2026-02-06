/**
 * Verify the complete authentication flow
 */
import jwt from 'jsonwebtoken';
import { verifyMessage } from 'viem';

async function verifyFlow() {
  console.log('🔍 Self-Check: Token Authentication Flow\n');
  console.log('═══════════════════════════════════════\n');

  // Generate a test token
  const { AgentWallet } = await import('./src/blockchain/agent-wallet');
  const crypto = await import('crypto');
  
  const testPrivateKey = '0x' + crypto.randomBytes(32).toString('hex');
  const { privateKeyToAccount } = await import('viem/accounts');
  const account = privateKeyToAccount(testPrivateKey as `0x${string}`);
  
  console.log('Step 1: Create Test Wallet');
  console.log('✅ Test wallet:', account.address);
  
  console.log('\nStep 2: Generate Token with Wallet Signature');
  const wallet = new AgentWallet({ userId: 'test-user' });
  await wallet.initialize();
  
  const token = await wallet.generateAuthToken({
    agentUserId: 123,
    identityData: {
      personalityType: 'The Visionary',
      tagline: 'Test tagline',
      description: 'Test description',
      mainCategories: ['Crypto'],
      subCategories: ['DeFi'],
      confidence: 85,
      mode: 'data',
    },
  });
  
  console.log('✅ Token generated');
  
  // Decode token
  console.log('\nStep 3: Verify JWT Structure');
  const decoded: any = jwt.decode(token, { complete: true });
  console.log('✅ JWT is well-formed');
  console.log('  Algorithm:', decoded.header.alg);
  console.log('  Has signature field:', !!decoded.payload.signature);
  console.log('  Has signedMessage field:', !!decoded.payload.signedMessage);
  console.log('  Has identity field:', !!decoded.payload.identity);
  
  // Verify JWT signature
  console.log('\nStep 4: Verify JWT Signature');
  const jwtSecret = process.env.JWT_SECRET || 'b87ebb08fc5307a70f3ee23842facdaaf7324361055cee10497d8c9df0230500';
  try {
    jwt.verify(token, jwtSecret, {
      issuer: 'bloom-protocol',
      audience: 'bloom-dashboard',
      algorithms: ['HS256'],
    });
    console.log('✅ JWT signature valid');
  } catch (error) {
    console.error('❌ JWT verification failed:', error);
    process.exit(1);
  }
  
  // Check required fields
  console.log('\nStep 5: Check Required Fields');
  const payload = decoded.payload;
  const requiredFields = [
    'type', 'version', 'address', 'nonce', 'timestamp',
    'expiresAt', 'scope', 'signature', 'signedMessage', 'identity'
  ];
  
  const missing = requiredFields.filter(f => !payload[f]);
  if (missing.length > 0) {
    console.error('❌ Missing fields:', missing);
    process.exit(1);
  }
  console.log('✅ All required fields present');
  
  // Verify wallet signature
  console.log('\nStep 6: Verify Wallet Signature');
  try {
    const isValid = await verifyMessage({
      address: payload.address as `0x${string}`,
      message: payload.signedMessage,
      signature: payload.signature as `0x${string}`,
    });
    
    if (isValid) {
      console.log('✅ Wallet signature valid');
    } else {
      console.error('❌ Wallet signature invalid');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Signature verification error:', error);
    process.exit(1);
  }
  
  console.log('\n═══════════════════════════════════════');
  console.log('✅ ALL CHECKS PASSED!');
  console.log('\n📋 Summary:');
  console.log('  ✅ Token structure correct');
  console.log('  ✅ JWT signature valid');
  console.log('  ✅ Wallet signature valid');
  console.log('  ✅ All required fields present');
  console.log('  ✅ Identity metadata included');
  
  console.log('\n⚠️  IMPORTANT: Verify Railway configuration:');
  console.log('  1. JWT_SECRET must be set to:');
  console.log('     b87ebb08fc5307a70f3ee23842facdaaf7324361055cee10497d8c9df0230500');
  console.log('  2. Frontend must be deployed with latest middleware (commit fb93367)');
  console.log('  3. Frontend viem version must be ^2.40.3');
}

verifyFlow().catch(console.error);
