import { useState } from "react";
import { Link } from "react-router-dom";
import { AppLogo } from "./AppLogo";
import { PageNav } from "./PageNav";
import { LoginForm } from "./LoginForm";
import { UserManagement } from "./UserManagement";
import { useAuth } from "../hooks/useAuth";

interface HeaderProps {
  title: string;
  className?: string;
  linkToHome?: boolean;
}

export function Header({ title, className, linkToHome }: HeaderProps) {
  const { auth, login, logout } = useAuth();
  const [showUserManagement, setShowUserManagement] = useState(false);

  return (
    <>
      <header className={className}>
        <h1>
          <AppLogo linkToHome={linkToHome} />
          {title}
        </h1>
        <PageNav />
        <div className="auth-section">
          {auth.isAuthenticated ? (
            <div className="user-info">
              {auth.isAdmin && (
                <>
                  <Link to="/play" className="admin-btn">
                    Play
                  </Link>
                  <button
                    onClick={() => setShowUserManagement(true)}
                    className="admin-btn"
                  >
                    Users
                  </button>
                </>
              )}
              <Link to="/account" className="username-link">
                {auth.username}
              </Link>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <LoginForm
              onLogin={(username, password) => login({ username, password })}
            />
          )}
        </div>
      </header>

      {showUserManagement && auth.isAdmin && auth.token && (
        <UserManagement
          token={auth.token}
          currentUsername={auth.username!}
          onClose={() => setShowUserManagement(false)}
        />
      )}
    </>
  );
}
