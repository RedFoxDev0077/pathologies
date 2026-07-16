import { casaDiagAPI } from './api/casadiag-api';

export interface PaymentLinkResponse {
  url: string;
  caseId: string;
  amount: number;
  currency: string;
}

/**
 * Gets Stripe Payment Link URL for a case
 * Simpler approach than Checkout Sessions - just redirect to the link
 */
export async function getPaymentLink(caseId: string): Promise<PaymentLinkResponse> {
  try {
    const response = await casaDiagAPI.createPaymentIntent(caseId, 'informe_preliminar_remoto');

    // Map the response to PaymentLinkResponse format
    return {
      url: response.paymentUrl,
      caseId: caseId,
      amount: response.totalAmount,
      currency: response.currency,
    };
  } catch (error) {
    console.error('Error getting Stripe payment link:', error);
    throw new Error('No se pudo obtener el enlace de pago. Por favor, inténtalo de nuevo.');
  }
}

/**
 * Verifies payment status after Stripe redirect
 */
export async function verifyPaymentStatus(
  sessionId: string
): Promise<{ status: 'paid' | 'unpaid' | 'pending'; caseId?: string }> {
  try {
    const response = await casaDiagAPI.get<{
      status: 'paid' | 'unpaid' | 'pending';
      caseId?: string;
    }>(`/payments/verify-session/${sessionId}`);
    return response;
  } catch (error) {
    console.error('Error verifying payment status:', error);
    throw new Error('No se pudo verificar el estado del pago.');
  }
}

/**
 * Confirms case data before payment
 */
export async function confirmCaseData(caseId: string): Promise<void> {
  try {
    await casaDiagAPI.post(`/cases/${caseId}/confirm-data`);
  } catch (error) {
    console.error('Error confirming case data:', error);
    throw new Error('No se pudo confirmar la información del caso.');
  }
}
