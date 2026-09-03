import { kv as vercelKv } from "@vercel/kv";

const isConfigured = !!(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_ACCESS_TOKEN
);

export type PaymentMapping = {
  olistOrderId: number;
  externalRef: string;
};

export async function storePaymentMapping(
  paymentId: string | number,
  olistOrderId: number,
  externalRef: string
): Promise<void> {
  if (!isConfigured) {
    console.warn("KV: not configured — payment mapping not stored");
    return;
  }
  try {
    await vercelKv.set(`mp:${paymentId}`, {
      olistOrderId,
      externalRef,
    } satisfies PaymentMapping);
    console.log(`KV: stored mapping payment ${paymentId} → order #${olistOrderId}`);
  } catch (err) {
    console.error("KV: failed to store mapping", err);
  }
}

export async function getPaymentMapping(
  paymentId: string | number
): Promise<PaymentMapping | null> {
  if (!isConfigured) {
    console.warn("KV: not configured — cannot look up payment mapping");
    return null;
  }
  try {
    const data = await vercelKv.get<PaymentMapping>(`mp:${paymentId}`);
    return data ?? null;
  } catch (err) {
    console.error("KV: failed to get mapping", err);
    return null;
  }
}

export async function deletePaymentMapping(
  paymentId: string | number
): Promise<void> {
  if (!isConfigured) return;
  try {
    await vercelKv.del(`mp:${paymentId}`);
  } catch (err) {
    console.error("KV: failed to delete mapping", err);
  }
}