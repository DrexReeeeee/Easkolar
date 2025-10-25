import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', formData);
      console.log('Login success:', res.data);
      localStorage.setItem('token', res.data.token); // store JWT for later use
      localStorage.setItem('user', JSON.stringify(res.data.user));

      if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <div className="auth-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '32px' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '16px', height: '40px', lineHeight: '40px' }}>Sign In</h2>
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            style={{ width: '100%', height: '48px', padding: '12px', marginBottom: '16px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={{ width: '100%', height: '48px', padding: '12px', marginBottom: '16px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }}
          />
          <button type="submit" disabled={loading} style={{ width: '100%', height: '48px', padding: '12px', background: 'linear-gradient(135deg, #4299e1, #667eea)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', boxSizing: 'border-box' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        {error && <p className="error" style={{ color: 'red', marginTop: '16px', fontSize: '16px', height: '20px', lineHeight: '20px' }}>{error}</p>}
        <p style={{ marginTop: '16px', fontSize: '16px', height: '20px', lineHeight: '20px' }}>Don’t have an account? <Link to="/SignUp">Sign Up</Link></p>
      </div>
      <div style={{ width: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #4299e1, #667eea)', borderRadius: '20px 0 0 20px', marginRight: '0', height: '100vh' }}>
        {/* Rounded rectangle placeholder */}
      </div>
    </div>
  );
};

export default SignIn;
