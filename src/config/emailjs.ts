// EmailJS Configuration
// Replace these values with your actual EmailJS credentials

export const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_service_id',
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your_template_id',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key',
};

// Email template parameters interface
export interface EmailTemplateParams {
  from_name: string;
  from_email: string;
  message: string;
  to_name: string;
  reply_to: string;
}

// Error messages for different EmailJS error types
export const EMAILJS_ERROR_MESSAGES = {
  INVALID_PUBLIC_KEY: 'Configuration error. Please contact the administrator.',
  NETWORK: 'Network error. Please check your connection and try again.',
  INITIALIZE: 'Service initialization failed. Please try again later.',
  DEFAULT: 'Something went wrong. Please try again or contact me directly via email.',
} as const;

// Function to get appropriate error message
export const getEmailJSErrorMessage = (error: Error): string => {
  const errorMessage = error.message;

  for (const [key, message] of Object.entries(EMAILJS_ERROR_MESSAGES)) {
    if (errorMessage.includes(key)) {
      return message;
    }
  }

  return EMAILJS_ERROR_MESSAGES.DEFAULT;
};
