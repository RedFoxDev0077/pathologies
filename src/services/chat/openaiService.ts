// AI Chat Widget Service - calls backend API (no API key exposed in browser)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://patologias.micasaverde.es/api';

export async function getAIResponse(userMessage: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/widget`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.reply || 'Lo siento, no pude procesar tu pregunta. ¿Podrías reformularla?';
  } catch (error) {
    console.error('Chat widget error:', error);
    return 'Lo siento, el servicio no está disponible en este momento. Por favor, contacta con nosotros directamente.';
  }
}
