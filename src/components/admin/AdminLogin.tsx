import { useState, type FormEvent } from "react";
import BrandTitle from "../BrandTitle.tsx";
import { adminStrings } from "../../config/adminStrings";
import { villageTitle } from "../../config/village";

interface AdminLoginProps {
  /** Message shown when a previous attempt was rejected with 401. */
  message?: string;
  onSubmit: (username: string, password: string) => void;
}

export default function AdminLogin({ message, onSubmit }: AdminLoginProps) {
  const { login } = adminStrings;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim() || !password) {
      setError(login.required);
      return;
    }

    setError("");
    onSubmit(username.trim(), password);
  };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <span className="admin-login-brand">
          <BrandTitle title={villageTitle()} />
        </span>

        <h1 className="admin-login-title">{login.title}</h1>

        <p className="card-text">{login.intro}</p>

        {message ? (
          <div className="form-error" role="alert">
            {message}
          </div>
        ) : null}

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="label" htmlFor="admin-username">
              {login.username}
            </label>

            <input
              id="admin-username"
              className="input"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="admin-password">
              {login.password}
            </label>

            <input
              id="admin-password"
              className="input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error ? (
            <span className="field-error">
              {error}
            </span>
          ) : null}

          <button type="submit" className="btn btn-primary">
            {login.submit}
          </button>

          <span className="field-note">
            {login.remember}
          </span>
        </form>
      </div>
    </div>
  );
}