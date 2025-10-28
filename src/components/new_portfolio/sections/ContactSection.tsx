import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG, getEmailJSErrorMessage } from '../../../config/emailjs';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Send email using EmailJS
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_name: 'Wiktor Czyż',
        reply_to: formData.email,
      };

      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      setSubmitStatus('success');
      setSubmitMessage("Thank you for your message! I'll get back to you soon.");
      setFormData({ name: '', email: '', message: '' });
      setErrors({});

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 5000);
    } catch (error) {
      console.error('EmailJS Error:', error);

      // Handle specific EmailJS errors
      const errorMessage =
        error instanceof Error
          ? getEmailJSErrorMessage(error)
          : 'An unexpected error occurred. Please try again.';

      setSubmitStatus('error');
      setSubmitMessage(errorMessage);

      // Reset error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section id="contact" className="contact-section content-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-bracket">{'<'}</span>
            CONTACT
            <span className="title-bracket">{'/>'}</span>
          </h2>
          <div className="title-line"></div>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h3 className="contact-subtitle">Let's Connect</h3>
            <p className="contact-text">
              I'm always interested in hearing about new projects and opportunities. Whether you
              have a question or just want to say hi, feel free to reach out!
            </p>

            <div className="contact-methods">
              <a href="mailto:wiktor@czyz.dev" className="contact-method">
                <span className="method-icon">✉</span>
                <span className="method-text">wiktor@czyz.dev</span>
              </a>
              <a href="https://github.com/LiptonAkaSaga" className="contact-method">
                <span className="method-icon">⚡</span>
                <span className="method-text">github.com/LiptonAkaSaga</span>
              </a>
              <a href="https://www.linkedin.com/in/wiktor-czyz/" className="contact-method">
                <span className="method-icon">💼</span>
                <span className="method-text">linkedin.com/in/wiktor-czyz</span>
              </a>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <span className="terminal-prompt">{'>'}</span> Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <span className="terminal-prompt">{'>'}</span> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">
                <span className="terminal-prompt">{'>'}</span> Message
              </label>
              <textarea
                id="message"
                name="message"
                className={`form-input form-textarea ${errors.message ? 'error' : ''}`}
                placeholder="Your message..."
                rows={5}
                value={formData.message}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
              {errors.message && <span className="form-error">{errors.message}</span>}
            </div>

            {/* Status Messages */}
            {submitMessage && (
              <div className={`form-status ${submitStatus}`}>
                <span className="status-icon">
                  {submitStatus === 'success' ? '✓' : submitStatus === 'error' ? '✗' : ''}
                </span>
                {submitMessage}
              </div>
            )}

            <button
              type="submit"
              className={`cyber-button primary full-width ${isSubmitting ? 'submitting' : ''}`}
              disabled={isSubmitting}
            >
              <span className="button-text">{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              <span className="button-icon">
                {isSubmitting ? <div className="spinner"></div> : '→'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
