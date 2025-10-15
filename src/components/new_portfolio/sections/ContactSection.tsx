import React from 'react';

const ContactSection: React.FC = () => {
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

          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <span className="terminal-prompt">{'>'}</span> Name
              </label>
              <input
                type="text"
                id="name"
                className="form-input"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <span className="terminal-prompt">{'>'}</span> Email
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">
                <span className="terminal-prompt">{'>'}</span> Message
              </label>
              <textarea
                id="message"
                className="form-input form-textarea"
                placeholder="Your message..."
                rows={5}
                required
              ></textarea>
            </div>

            <button type="submit" className="cyber-button primary full-width">
              <span className="button-text">Send Message</span>
              <span className="button-icon">→</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
