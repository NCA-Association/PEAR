import { getAllPrograms } from "../adapters/program-adapter.js";
import { NavLink, Link,  useNavigate } from "react-router-dom";

import Waves01SVG from '../components/Waves01SVG.jsx'
import Waves02SVG from '../components/Waves02SVG.jsx'
import KidCompassSVG from '../components/KidCompassSVG.jsx'
import { useState, useEffect, useContext } from "react";

import "./Home.css";
import CurrentUserContext from "../contexts/current-user-context.js";


const nameTextLimiter3000 = (str) => {
  if (str.length > 26) {
    str = str.substring(0, 26) + '...';
  }
  return str;
}

const descTextLimiter3000 = (str) => {
  if (str.length > 300) {
    str = str.substring(0, 256) + '...';
  }
  return str;
}


export default function HomePage() {
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState("");
  const {currentUser} = useContext(CurrentUserContext);
  useEffect(() => {
    const getPrograms = async () => {
      const data = await getAllPrograms();
      if (data) setPrograms(data.slice(-3).reverse());
      if (error) setError(error);
    };
    getPrograms();
  }, []);

  const headliner = "Youth Resources for Children in NYC ";
  const subtitle = "A centralized platform to help parents to find resources for their kids.";

  return (
    <>
      <section id="bnr-section" className="bnr-section">
        <div id="top-prt">
          <div id="bnr-text-div">
            <h2 id="bnr-text" className="title-font">{headliner}</h2>
            <p id="bnr-subtitle" className="normal-font">{subtitle}</p>
          </div>
          <div>
            {/* <KidCompassSVG /> */}
            {/* <img src="https://www.freeiconspng.com/thumbs/kids-png/kids-png--8.png" alt="" /> */}
          </div>
        </div>
        {
          currentUser === null &&
        <section id="home-acc-buttons-section">
          <div id="login-signup-buttons">
            {/* <div className="home-space2"></div> */}
            <div className="buttons1"> 
            <NavLink to='/signup'>
              <button id="signup-button" className="raleway">SIGN UP</button>
              </NavLink>
            </div>
            <div className="buttons2">
              <NavLink to='/login'>
              <button id="login-button" className="raleway">LOGIN</button>
              </NavLink>
            </div>
            {/* <div className="home-spacer2"></div> */}
          </div>
        </section>
}
      </section>

      <div className="bg-brown">
        <Waves01SVG />
        <Waves02SVG />
      </div>




      <section id="hm-programs-section">
        <h2 className="subtitle-font">Recently Added:</h2>
    
          {/* <img src={programs[programs.length - 1].imgUrl} alt="hi" /> */}

          <div id="hm-programsUl">
            {programs.map((program, idx) => {
              return (
                <div key={idx}>
                  <div className={`hm-card`}>
                    <div className={`hm-card-img`}>
                      <img
                        className={`hm-card-img`}
                        src={program.imgUrl}
                        alt={program.name}
                      />
                    </div>
                    <div className={`hm-card-content`}>
                      <NavLink to={`/opportunities/${program.id}`}>
                        <span className={`hm-card-title`}>
                          {nameTextLimiter3000(program.name)}
                        </span>
                      </NavLink>
                      <p className={`hm-card-desc`}>
                        {descTextLimiter3000(program.bio)}
                      </p>

                      <NavLink
                        className="action"
                        to={`/opportunities/${program.id}`}
                      >
                        Find out more
                        <span aria-hidden="true">→</span>
                      </NavLink>
                    </div>
                  </div>

                  {/* <div>
                    <img id="li-thumbnail" src={program.imgUrl} alt={program.id} />
                    <Link to={`/programs/${program.id}`}>{program.name}</Link>
                    <p>{program.name}</p>
                  </div> */}
                </div>
              );
            })}
   

        </div>
      </section>
    </>
  );
}
