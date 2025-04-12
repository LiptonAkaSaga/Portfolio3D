import React from 'react';
import signatureLogo from './images/signature Logo.png';
import lineImage from './images/line-19.svg';
import linkedinIcon from './images/Icons/Linkdin.svg';
import discordIcon from './images/Icons/Discord.svg';
import githubIcon from './images/Icons/Github.svg';

const Footer: React.FC = () => (
  <footer className="text-white">
    <div className="container p-4 pb-0">
      <div className="col-lg-12">
        <img src={lineImage} alt="line" />
      </div>
      <div className="row align-items-top">
        <div className="col-lg-4">
          <div className="logo">
            <img src={signatureLogo} alt="logo" />
          </div>
          <div className="row"></div>
          <h4>C++ Programmer and back-end developer</h4>
        </div>
        <div className="col-lg-6"></div>
        <div className="col-lg-2" id="Icons">
          <a href="https://www.linkedin.com/in/wiktor-czyz/" target="_blank">
            <img src={linkedinIcon} alt="LinkedIn" />
          </a>
          <a href="https://discordapp.com/users/liptonakasaga" target="_blank">
            <img src={discordIcon} alt="Discord" />
          </a>
          <a href="https://github.com/LiptonAkaSaga" target="_blank">
            <img src={githubIcon} alt="GitHub" />
          </a>
        </div>
      </div>
    </div>
    <div className="text-center p-3">
      © 2023 Copyright. <a href="#home">Made by W.Czyż</a>
    </div>
  </footer>
);

export default Footer;
