export type PaymentConfig = {
  upiId: string;
  upiName: string;
  whatsappNumber: string;
  /** Legacy; not used for QR generation */
  qrImageUrl?: string;
};
