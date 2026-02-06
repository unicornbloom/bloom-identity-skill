# Dashboard Link Implementation - Clean & Secure

## 🎯 Problem Summary

**Before:**
- Dashboard URL was 400+ characters long (full JWT token in URL)
- JWT contained sensitive signature data and wallet messages
- 24-hour expiry made links temporary (bad UX for saved identity cards)
- Environment pointing to wrong domain (preview vs preflight)
- Dashboard couldn't display agent cards

## ✅ Solution

**New Flow:**
1. Generate identity card data
2. Initialize agent wallet
3. Register agent with Bloom → get `agentUserId`
4. **Save identity card data** to Bloom backend (new endpoint)
5. Create permanent dashboard link: `https://preflight.bloomprotocol.ai/agent/{agentUserId}`

**Benefits:**
- ✅ Short URL (~50 chars vs 400+ chars)
- ✅ No sensitive data in URL (no signatures, no private keys)
- ✅ No expiry - permanent link to view identity card
- ✅ Correct environment (preflight)
- ✅ Clean architecture - backend stores data, frontend displays it

---

## 🔧 Changes Made

### **1. Skill Code (`bloom-identity-skill-v2.ts`)**

**Updated Step 5:**
```typescript
// Step 5: Register agent and save identity card with Bloom
try {
  // Register agent with Bloom backend
  const registration = await this.agentWallet!.registerWithBloom('Bloom Skill Discovery Agent');
  agentUserId = registration.agentUserId;

  // Save identity card data to Bloom backend
  await this.agentWallet!.saveIdentityCard(agentUserId, {
    personalityType: identityData!.personalityType,
    customTagline: identityData!.customTagline,
    customDescription: identityData!.customDescription,
    mainCategories: identityData!.mainCategories,
    subCategories: identityData!.subCategories,
    dataQuality,
    mode: usedManualQA ? 'manual' : 'data',
  });

  // Create permanent dashboard link (no expiry, no sensitive data)
  const baseUrl = process.env.DASHBOARD_URL || 'https://preflight.bloomprotocol.ai';
  dashboardUrl = `${baseUrl}/agent/${agentUserId}`;
}
```

### **2. Agent Wallet (`agent-wallet.ts`)**

**Added new method: `saveIdentityCard()`**
```typescript
async saveIdentityCard(agentUserId: number, identityData: {
  personalityType: string;
  customTagline: string;
  customDescription: string;
  mainCategories: string[];
  subCategories: string[];
  dataQuality?: number;
  mode?: string;
}): Promise<{ success: boolean; cardId?: string }>
```

**What it does:**
- Calls `POST /agent/identity-card` on Bloom backend
- Sends identity card data with agent user ID
- Signs the data to prove authenticity
- Non-critical (won't fail skill if backend unavailable)

### **3. Environment Config (`.env.example`)**

**Updated default:**
```bash
# Before
DASHBOARD_URL=http://localhost:3000

# After
DASHBOARD_URL=https://preflight.bloomprotocol.ai
```

---

## 🎨 Backend Requirements

### **New Endpoint: `POST /agent/identity-card`**

**Request:**
```json
{
  "agentUserId": 416543868,
  "walletAddress": "0x1234...",
  "identityData": {
    "personalityType": "The Visionary",
    "customTagline": "Early adopter shaping crypto's future",
    "customDescription": "You're not just following trends...",
    "mainCategories": ["DeFi", "Infrastructure", "Social"],
    "subCategories": ["defi", "dao", "nft"],
    "dataQuality": 85,
    "mode": "data"
  },
  "signature": "0xabc...",
  "timestamp": 1707234567890
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cardId": "abc123" // Optional, if you want to track card IDs
  }
}
```

**What backend should do:**
1. Verify signature (optional - can trust the agent wallet)
2. Store identity card data associated with `agentUserId`
3. Overwrite previous card if exists (agents can regenerate)
4. Return success

### **Frontend Route: `/agent/{agentUserId}`**

**What frontend should do:**
1. Extract `agentUserId` from URL path
2. Fetch identity card data from backend: `GET /agent/{agentUserId}/identity-card`
3. Display identity card with all data:
   - Personality type + emoji
   - Tagline
   - Description
   - Categories
   - Data quality score
   - Mode (manual vs data-driven)
4. If no card exists, show friendly message: "No identity card found for this agent"

---

## 🔒 Security Notes

**What's in the URL:**
- ✅ Only public agent user ID (e.g., `416543868`)
- ✅ No wallet addresses
- ✅ No private keys
- ✅ No signatures
- ✅ No JWT tokens

**What's secure:**
- Identity card data is signed by agent wallet (proves authenticity)
- Data is stored on backend, not exposed in URL
- Link is permanent - no expiry concerns
- Anyone with the link can view the card (public by design)

**Note:** Identity cards are meant to be **publicly shareable**. This is similar to ENS profiles, Twitter profiles, etc. If agents want private data, that should use separate authentication.

---

## 📝 Migration Notes

**For existing agents:**
- Old JWT-based links will stop working once frontend removes JWT handling
- Agents can regenerate their identity cards to get new permanent links
- No data loss - cards are re-creatable from on-chain/manual data

**For testing:**
- Use `DASHBOARD_URL=http://localhost:3000` for local development
- Ensure backend endpoint exists before pushing to production
- Frontend should handle missing cards gracefully

---

## 🎉 Example Output

**Before (400+ chars):**
```
https://preview.bloomprotocol.ai/dashboard?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWdlbnQiLCJ2ZXJzaW9uIjoiMS4wIiwiYWRkcmVzcyI6IjB4MTIzNC4uLiIsIm5vbmNlIjoiYWJjLTEyMy14eXoiLCJ0aW1lc3RhbXAiOjE3MDcyMzQ1Njc4OTAsImV4cGlyZXNBdCI6MTcwNzMyMDk2Nzg5MCwic2NvcGUiOlsicmVhZDppZGVudGl0eSIsInJlYWQ6c2tpbGxzIiwicmVhZDp3YWxsZXQiXSwic2lnbmF0dXJlIjoiMHhhYmMuLi4iLCJzaWduZWRNZXNzYWdlIjoiQmxvb20gQWdlbnQgQXV0aGVudGljYXRpb25cbkFkZHJlc3M6IDB4MTIzNC4uLiJ9.xyz123...
```

**After (~50 chars):**
```
https://preflight.bloomprotocol.ai/agent/416543868
```

**Improvement:** 88% shorter, cleaner, shareable, permanent! 🎉

---

Built with ❤️ for better UX and security
