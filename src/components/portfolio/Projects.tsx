import React from 'react';
import lineImage from './images/line.svg';
import portfolioImage from './images/Projects/portfolio middle.svg';
import lamboImage from './images/Projects/lambooo 1 middle.svg';
import kitchenImage from './images/Projects/Kuchennarewolucja (2) middle.svg';

const Projects: React.FC = () => (
  <section id="projects">
    <div className="container">
      <div className="col-lg-6 header">
        <div className="row align-items-center">
          <div className="col-lg-4 title">
            <h2>
              <span className="oneword">/</span>projects
            </h2>
          </div>
          <div className="col-lg-8 line">
            <img src={lineImage} alt="line" />
          </div>
        </div>
      </div>
      <div className="row align-items-top row-gap-5">
        <div className="col-lg-4">
          <div className="card">
            <img src={portfolioImage} className="card-img-top" alt="portfolio" />
            <div className="card-body">
              <p>Html Css Js Css.bootstrap</p>
              <h5 className="card-title">Portfolio</h5>
              <p className="card-text">You are literally looking at it now</p>
              <a
                href="https://github.com/LiptonAkaSaga/Portfolio"
                target="_blank"
                className="btn btn-outline-primary"
              >
                Github
              </a>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card">
            <img src={lamboImage} className="card-img-top" alt="lambo" />
            <div className="card-body">
              <p>3ds_Max Maya Blender</p>
              <h5 className="card-title">Lamborghini Countach</h5>
              <p className="card-text">3D model for a simple Unity game</p>
              <a href="#" className="btn btn-outline-primary">
                Github
              </a>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card">
            <img src={kitchenImage} className="card-img-top" alt="kitchen" />
            <div className="card-body">
              <p>Html Css Js Css.bootstrap</p>
              <h5 className="card-title">Kuchennarewolucja</h5>
              <p className="card-text">Kitchenware shop in progress</p>
              <a href="#" className="btn btn-outline-primary">
                Go somewhere
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Projects;
