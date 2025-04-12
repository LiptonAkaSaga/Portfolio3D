import React from 'react';
import lineImage from './images/line.svg';

const ContactMe: React.FC = () => (
  <section id="contact-me">
    <div className="container">
      <div className="col-lg-6 header row mb-5">
        <div className="col-lg-4 title">
          <h2>
            <span className="oneword">/</span>contact-me
          </h2>
        </div>
        <div className="col-lg-8 line">
          <img src={lineImage} alt="line" />
        </div>
      </div>
      <div className="contact">
        <div className="col-lg-3 col-md-3"></div>
        <div className="col-lg-6 col-md-6">
          <form method="post">
            <div className="col-lg-4 col-md-4">
              <input
                type="text"
                name="name"
                className="form-control mb-2 "
                placeholder="Name"
                required
              />
            </div>
            <div className="col-lg-6 col-md-6">
              <input
                type="email"
                name="email"
                className="form-control mb-2"
                placeholder="Email"
                required
              />
            </div>
            <div className="">
              <input
                type="text"
                name="subject"
                className="form-control mb-2"
                placeholder="Title"
                required
              />
            </div>
            <div className="">
              <textarea
                name="message"
                className="form-control mb-2"
                rows={5}
                placeholder="Message"
                required
              ></textarea>
              <button type="submit" className="btn btn-outline-primary mt-3">
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="col-lg-3 col-md-3"></div>
    </div>
  </section>
);

export default ContactMe;
