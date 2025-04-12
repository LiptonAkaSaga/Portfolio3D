import React from 'react';
import lineImage from './images/line.svg';

const Pricing: React.FC = () => (
  <section id="pricing">
    <div className="container">
      <div className="col-lg-6 header row mb-5">
        <div className="col-lg-4 title">
          <h2>
            <span className="oneword">/</span>pricing
          </h2>
        </div>
        <div className="col-lg-8 line">
          <img src={lineImage} alt="line" />
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <h2>Pricing per hour</h2>
          <form>
            <label>Graphics service hours</label>
            <input type="range" className="form-control" min="0" max="24" step="1" />
            <label>Management service hours</label>
            <input type="range" className="form-control" min="0" max="24" step="1" />
            <label>Programming service hours</label>
            <input type="range" className="form-control" min="0" max="24" step="1" />
            <button type="button" className="btn btn-outline-primary mt-5">
              Calculate
            </button>
          </form>
          <br />
          <div>Total Cost:</div>
        </div>
      </div>
    </div>
  </section>
);

export default Pricing;
