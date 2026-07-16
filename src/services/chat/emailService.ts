// Email Service for complex question notifications
import emailjs from "@emailjs/browser";

// EmailJS configuration
// You'll need to set these up at https://www.emailjs.com/
const EMAILJS_SERVICE_ID = "service_micasaverde"; // Replace with your service ID
const EMAILJS_TEMPLATE_ID = "template_contact"; // Replace with your template ID
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; // Replace with your public key

interface ContactNotification {
  userQuestion: string;
  userName?: string;
  userEmail?: string;
  detectedKeywords: string[];
  timestamp: string;
}

export async function sendContactNotification(data: ContactNotification): Promise<boolean> {
  try {
    // For now, we'll log the notification
    // In production, configure EmailJS with your credentials
    console.log("Contact notification:", {
      to: import.meta.env.VITE_CLIENT_EMAIL,
      ...data,
    });

    // Uncomment this when EmailJS is configured:
    /*
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: import.meta.env.VITE_CLIENT_EMAIL,
        user_question: data.userQuestion,
        user_name: data.userName || "No proporcionado",
        user_email: data.userEmail || "No proporcionado",
        detected_keywords: data.detectedKeywords.join(", "),
        timestamp: data.timestamp,
      },
      EMAILJS_PUBLIC_KEY
    );
    */

    return true;
  } catch (error) {
    console.error("Email notification error:", error);
    return false;
  }
}

// Alternative: Use a simple webhook for notifications
export async function sendWebhookNotification(data: ContactNotification): Promise<boolean> {
  try {
    // You can set up a webhook URL (e.g., Zapier, Make, or your own backend)
    const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;

    if (!webhookUrl) {
      console.log("Webhook URL not configured. Notification data:", data);
      return true;
    }

    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        clientEmail: import.meta.env.VITE_CLIENT_EMAIL,
      }),
    });

    return true;
  } catch (error) {
    console.error("Webhook notification error:", error);
    return false;
  }
}
