import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
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
      const res = await axios.post('http://localhost:5001/api/auth/signup', formData);
        console.log('Signup success:', res.data);
        // Remove alert to avoid blocking navigation
        // alert('Signup successful! Redirecting to Sign In...');
        navigate('/SignIn');
      } catch (err) {
        console.error('Signup error:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Signup failed');
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="auth-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>Already have an account? <Link to="/SignIn">Sign In</Link></p>
    </div>
  );
};

export default SignUp;
