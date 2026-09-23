// Login.jsx
import { useContext, useState } from "react";
import { useNavigate, Navigate, NavLink } from "react-router-dom";
import { logUserIn, logOrganizationIn } from "../adapters/auth-adapter";
import CurrentUserContext from "../contexts/current-user-context";
import "./Login.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [errorText, setErrorText] = useState("");
  const { currentUser, setCurrentUser, setIsOrganization: setContextIsOrganization, isAuthLoading } = useContext(CurrentUserContext);
  const [isOrganization, setIsOrganization] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorText("");
    const formData = new FormData(event.target);
    const [user, error] = isOrganization
      ? await logOrganizationIn(Object.fromEntries(formData))
      : await logUserIn(Object.fromEntries(formData));
    if (error) return setErrorText(error.message);
    setCurrentUser(user);
    setContextIsOrganization(isOrganization);
    navigate("/opportunities");
  };

  if (isAuthLoading) return null;
  if (currentUser !== null) return <Navigate to="/" />;

  return (
    <section className="hero is-fullheight login-wrapper">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-5-tablet is-4-desktop is-3-widescreen">
              <div className="box login-box">
                {/* <h1 className="title has-text-centered pear-nyc-title">PEAR NYC</h1> */}
                <h2 className="subtitle has-text-centered">Login</h2>
                <div className="buttons is-centered">
                  <button
                    className={`button ${!isOrganization ? "is-user" : "is-light"}`}
                    onClick={() => setIsOrganization(false)}
                  >
                    User
                  </button>
                  <button
                    className={`button ${isOrganization ? "is-organization" : "is-light"}`}
                    onClick={() => setIsOrganization(true)}
                  >
                    Organization
                  </button>
                </div>
                <form onSubmit={handleSubmit} aria-labelledby="login-heading">
                  <div className="field">
                    <label htmlFor="username" className="label">
                      {isOrganization ? "Organization Name:" : "Username:"}
                    </label>
                    <div className="control">
                      <input
                        type="text"
                        autoComplete="username"
                        id="username"
                        name="username"
                        className="input"
                        placeholder={isOrganization ? "Enter organization name" : "Enter username"}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="password" className="label">
                      Password:
                    </label>
                    <div className="control">
                      <input
                        type="password"
                        autoComplete="current-password"
                        id="password"
                        name="password"
                        className="input"
                        placeholder="Enter password"
                      />
                    </div>
                  </div>
                  <div className="field">
                    <div className="control">
                      <button className="button is-primary is-fullwidth">
                        Login
                      </button>
                    </div>
                  </div>
                </form>
                {!!errorText && <p className="has-text-danger">{errorText}</p>}
                <p className="has-text-centered">
                  New? <NavLink to="/signup">Sign up today!</NavLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
