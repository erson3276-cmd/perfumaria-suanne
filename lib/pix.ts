import QRCode from "qrcode";

const pixKey = process.env.PIX_KEY ?? "";

const MERCHANT_NAME = "Perfumaria Suanne";
const MERCHANT_CITY = "Rio de Janeiro";

function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) !== 0 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function field(id: number, value: string): string {
  return `${String(id).padStart(2, "0")}${String(value.length).padStart(2, "0")}${value}`;
}

export function generatePixPayload(amount: number): string {
  const merchantAccount = field(0, "BR.GOV.BCB.PIX") + field(1, pixKey);

  const payload =
    field(0, "01") +
    field(1, "12") +
    field(26, merchantAccount) +
    field(52, "0000") +
    field(53, "986") +
    field(54, amount.toFixed(2)) +
    field(58, "BR") +
    field(59, MERCHANT_NAME) +
    field(60, MERCHANT_CITY) +
    field(62, field(5, "***"));

  return payload + "6304" + crc16(payload + "6304");
}

export async function generatePixQrCode(amount: number): Promise<string> {
  const payload = generatePixPayload(amount);
  return QRCode.toDataURL(payload, { width: 300, margin: 2 });
}
