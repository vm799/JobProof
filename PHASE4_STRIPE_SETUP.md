# Phase 4 Execution: Stripe & Commercialization

## Step 1: Stripe Products & Prices (No Code Yet)

### Billing Matrix

#### Free Tier
- **Product**: JobProof Free
- **Price**: $0/month
- **Limits**:
  - 5 Sites
  - 50 Jobs/month
  - 100 Proofs/month
  - Single user
  - Email support

#### Pro Tier
- **Product**: JobProof Pro
- **Price**: $49/month (annual: $490)
- **Limits**:
  - 50 Sites
  - 500 Jobs/month
  - 1000 Proofs/month
  - 5 team members
  - Priority support

#### Enterprise Tier
- **Product**: JobProof Enterprise
- **Price**: Custom (contact sales)
- **Limits**:
  - Unlimited Sites
  - Unlimited Jobs/month
  - Unlimited Proofs/month
  - Unlimited team members
  - Dedicated support
  - Custom integrations
- **Note**: Manual approval required, uses `stripe_customer_id` flag

### Stripe Configuration Steps

1. Create Products in Stripe Dashboard:
   - JobProof Free (no price, trial mode)
   - JobProof Pro ($49 monthly, $490 annually)
   - JobProof Enterprise (custom, manual)

2. Retrieve Product IDs and Price IDs once created

3. Store in environment variables:
   ```
   STRIPE_FREE_PRICE_ID=price_...
   STRIPE_PRO_MONTHLY_PRICE_ID=price_...
   STRIPE_PRO_ANNUAL_PRICE_ID=price_...
   STRIPE_ENTERPRISE_PRODUCT_ID=prod_...
   ```

4. Update `lib/billing.ts` with these IDs

### Domain Mapping

- Free → `billing_accounts.plan_tier = 'free'`
- Pro → `billing_accounts.plan_tier = 'pro'`
- Enterprise → `billing_accounts.plan_tier = 'enterprise'` + manual review flag

## Next Steps

After Step 1 is confirmed:
→ Step 2: Workspace ↔ Stripe Customer Wiring
→ Step 3: Webhooks (idempotency + audit)
→ Step 4: Hard Plan Enforcement
→ Step 5: Billing UI
