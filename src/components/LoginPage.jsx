import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, loginUser, logoutUser, clearError } from '../redux/userSlice';
import Homepage from './Homepage';
import './LoginPage.css';

export default function LoginPage() {
  const dispatch = useDispatch();
  const { isAuthenticated, currentUser, error, loading, registeredUsers } = useSelector((state) => state.user);
  
  const [activeTab, setActiveTab] = useState('login');
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginEmailFocus, setLoginEmailFocus] = useState(false);
  const [loginPasswordFocus, setLoginPasswordFocus] = useState(false);
  
  // Register form states
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regFullNameFocus, setRegFullNameFocus] = useState(false);
  const [regEmailFocus, setRegEmailFocus] = useState(false);
  const [regPasswordFocus, setRegPasswordFocus] = useState(false);
  const [regConfirmPasswordFocus, setRegConfirmPasswordFocus] = useState(false);
  const [regError, setRegError] = useState('');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    dispatch(clearError());
    setRegError('');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());
    
    if (!loginEmail || !loginPassword) {
      return;
    }

    if (!loginEmail.includes('@')) {
      return;
    }

    if (loginPassword.length < 6) {
      return;
    }

    dispatch(loginUser({ email: loginEmail, password: loginPassword }));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');
    dispatch(clearError());

    if (!regFullName || !regEmail || !regPassword || !regConfirmPassword) {
      setRegError('Please fill in all fields');
      return;
    }

    if (!regEmail.includes('@')) {
      setRegError('Please enter a valid email');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match');
      return;
    }

    dispatch(registerUser({ email: regEmail, password: regPassword, fullName: regFullName }));

    setRegFullName('');
    setRegEmail('');
    setRegPassword('');
    setRegConfirmPassword('');

    setTimeout(() => {
      setActiveTab('login');
      setRegError('');
    }, 1000);
  };

  const handleLoginKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLoginSubmit(e);
    }
  };

  const handleRegisterKeyPress = (e) => {    if (e.key === 'Enter') {
      e.preventDefault();
      handleRegisterSubmit(e);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setLoginEmail('');
    setLoginPassword('');
  };

  if (isAuthenticated && currentUser) {
    return <Homepage userEmail={currentUser.email} userName={currentUser.fullName} onLogout={handleLogout} />;
  }

  return (
    <div className="login-container">
      <div className="animated-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="login-box">
        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabChange('login')}
          >
            Sign In
          </button>
          <button
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => handleTabChange('register')}
          >
            Register
          </button>
        </div>

        {/* Login Tab */}
        {activeTab === 'login' && (
          <>
            <div className="form-header">
              <h1>Welcome Back</h1>
              <p className="subtitle">Sign in to your account</p>
            </div>

            <form onSubmit={handleLoginSubmit}>
              <div className={`form-group ${loginEmailFocus ? 'focused' : ''} ${loginEmail ? 'filled' : ''}`}>
                <label htmlFor="login-email">Email Address</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="login-email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    onFocus={() => setLoginEmailFocus(true)}
                    onBlur={() => setLoginEmailFocus(false)}
                    onKeyPress={handleLoginKeyPress}
                    className="input-field"
                  />
                  <div className="input-line"></div>
                </div>
              </div>

              <div className={`form-group ${loginPasswordFocus ? 'focused' : ''} ${loginPassword ? 'filled' : ''}`}>
                <label htmlFor="login-password">Password</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    id="login-password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onFocus={() => setLoginPasswordFocus(true)}
                    onBlur={() => setLoginPasswordFocus(false)}
                    onKeyPress={handleLoginKeyPress}
                    className="input-field"
                  />
                  <div className="input-line"></div>
                </div>
              </div>

              {error && <div className="error-message"><span>⚠</span> {error}</div>}

              <button type="submit" className="login-btn">
                <span className="btn-text">Sign In</span>
                <span className="btn-arrow">→</span>
              </button>
            </form>

            <div className="footer-text">
              <p>Registered users: {registeredUsers.length}</p>
            </div>
          </>
        )}

        {/* Register Tab */}
        {activeTab === 'register' && (
          <>
            <div className="form-header">
              <h1>Create Account</h1>
              <p className="subtitle">Join us today</p>
            </div>

            <form onSubmit={handleRegisterSubmit}>
              <div className={`form-group ${regFullNameFocus ? 'focused' : ''} ${regFullName ? 'filled' : ''}`}>
                <label htmlFor="reg-fullname">Full Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="reg-fullname"
                    placeholder="John Doe"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    onFocus={() => setRegFullNameFocus(true)}
                    onBlur={() => setRegFullNameFocus(false)}
                    onKeyPress={handleRegisterKeyPress}
                    className="input-field"
                  />
                  <div className="input-line"></div>
                </div>
              </div>

              <div className={`form-group ${regEmailFocus ? 'focused' : ''} ${regEmail ? 'filled' : ''}`}>
                <label htmlFor="reg-email">Email Address</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="reg-email"
                    placeholder="you@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    onFocus={() => setRegEmailFocus(true)}
                    onBlur={() => setRegEmailFocus(false)}
                    onKeyPress={handleRegisterKeyPress}
                    className="input-field"
                  />
                  <div className="input-line"></div>
                </div>
              </div>

              <div className={`form-group ${regPasswordFocus ? 'focused' : ''} ${regPassword ? 'filled' : ''}`}>
                <label htmlFor="reg-password">Password</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    id="reg-password"
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    onFocus={() => setRegPasswordFocus(true)}
                    onBlur={() => setRegPasswordFocus(false)}
                    onKeyPress={handleRegisterKeyPress}
                    className="input-field"
                  />
                  <div className="input-line"></div>
                </div>
              </div>

              <div className={`form-group ${regConfirmPasswordFocus ? 'focused' : ''} ${regConfirmPassword ? 'filled' : ''}`}>
                <label htmlFor="reg-confirm-password">Confirm Password</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    id="reg-confirm-password"
                    placeholder="••••••••"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    onFocus={() => setRegConfirmPasswordFocus(true)}
                    onBlur={() => setRegConfirmPasswordFocus(false)}
                    onKeyPress={handleRegisterKeyPress}
                    className="input-field"
                  />
                  <div className="input-line"></div>
                </div>
              </div>

              {regError && <div className="error-message"><span>⚠</span> {regError}</div>}

              <button type="submit" className="login-btn">
                <span className="btn-text">Create Account</span>
                <span className="btn-arrow">→</span>
              </button>
            </form>

            <div className="footer-text">
              <p>All fields are required</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
