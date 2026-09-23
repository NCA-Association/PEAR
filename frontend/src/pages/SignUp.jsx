// SignUp.jsx
import { useContext, useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import CurrentUserContext from "../contexts/current-user-context";
import { createUser } from "../adapters/user-adapter";
import { createOrganization } from "../adapters/organization-adapter";
import "./SignUp.css";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, setIsOrganization, isAuthLoading } = useContext(CurrentUserContext);
  const [errorText, setErrorText] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isOrgSignUp, setIsOrgSignUp] = useState(false);

  if (isAuthLoading) return null;
  if (currentUser) return <Navigate to="/" />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorText("");
    if (!username || !password)
      return setErrorText("Missing username or password");

    let user, error;
    if (isOrgSignUp) {
      setIsOrganization(true);
      [user, error] = await createOrganization({ username, password, pfp_url: "aig" });
    } else {
      setIsOrganization(false);
      [user, error] = await createUser({ username, password });
    }
    if (error) return setErrorText(error.message);
    setCurrentUser(user);
    navigate("/opportunities");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "username") setUsername(value);
    if (name === "password") setPassword(value);
  };

  return (
    <section className="hero is-fullheight sign-up-wrapper">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-5-tablet is-4-desktop is-3-widescreen">
              <div className="box signup-box">
                {/* <h1 className="title has-text-centered pear-nyc-title">PEAR NYC</h1> */}
                <h2 className="subtitle has-text-centered">Sign Up</h2>
                <div className="buttons is-centered">
                  <button
                    className={`button ${!isOrgSignUp ? "is-user" : "is-light"} normal-font`}
                    onClick={() => setIsOrgSignUp(false)}
                  >
                    User
                  </button>
                  <button
                    className={`button ${isOrgSignUp ? "is-organization" : "is-light"}`}
                    onClick={() => setIsOrgSignUp(true)}
                  >
                    Organization
                  </button>
                </div>
                <form
                  onSubmit={handleSubmit}
                  onChange={handleChange}
                  aria-labelledby="create-heading"
                >
                  <div className="field">
                    <label htmlFor="username" className="label">
                      {isOrgSignUp ? "Organization Name:" : "Username:"}
                    </label>
                    <div className="control">
                      <input
                        autoComplete="off"
                        type="text"
                        id="username"
                        name="username"
                        onChange={handleChange}
                        value={username}
                        className="input"
                        placeholder={isOrgSignUp ? "Enter organization name" : "Enter username"}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="password" className="label">Password:</label>
                    <div className="control">
                      <input
                        autoComplete="off"
                        type="password"
                        id="password"
                        name="password"
                        onChange={handleChange}
                        value={password}
                        className="input"
                        placeholder="Enter password"
                      />
                    </div>
                  </div>
                  <div className="field">
                    <div className="control">
                      <button className="button is-primary is-fullwidth">Sign Up Now!</button>
                    </div>
                  </div>
                </form>
                {!!errorText && <p className="has-text-danger">{errorText}</p>}
                <p className="has-text-centered">
                  Already have an account with us? <Link to="/login">Log in!</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
