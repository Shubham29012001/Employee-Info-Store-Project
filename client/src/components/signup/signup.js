import { useState, useContext } from 'react';
import styles from './styles.module.css';
import { Link, useNavigate } from 'react-router-dom';
import AuthServices from '../../ApiServices/authServices.js';
import { loginContext } from '../context/contextProvider.js';

const Signup = () => {
  const navigate = useNavigate();
  const [loginData, setloginData] = useContext(loginContext);
  const [data, setData] = useState({
    name: '',
    dob: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
  });

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: res } = await AuthServices.signup(data);
      if (res) {
        localStorage.setItem('userDetails', JSON.stringify(res));
        navigate('/dashboard');
        setloginData(res);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        console.log(error.response.data.msg);
      }
    }
  };

  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.left}>
          <h1>Welcome Back</h1>
          <Link to="/login">
            <button type="button" className={styles.white_btn}>
              Sign in
            </button>
          </Link>
        </div>
        <div className={styles.right}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <input
              type="text"
              placeholder="Enter Your Full Name"
              name="name"
              onChange={handleChange}
              value={data.name}
              required
              className={styles.input}
              aria-describedby="nameHelp"
            />
            <input
              type="date"
              placeholder="Enter Your Date of Birth"
              name="dob"
              onChange={handleChange}
              value={data.dob}
              required
              className={styles.input}
              aria-describedby="dobHelp"
            />
            <input
              type="email"
              placeholder="Enter Your Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
              aria-describedby="emailHelp"
            />
            <input
              type="password"
              placeholder="Enter Your Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
              aria-describedby="passwordHelp"
            />
            <input
              type="password"
              placeholder="Confirm Your Password"
              name="confirmPassword"
              onChange={handleChange}
              value={data.confirmPassword}
              required
              className={styles.input}
              aria-describedby="confirmPasswordHelp"
            />
            <input
              type="text"
              placeholder="Enter Your Address"
              name="address"
              onChange={handleChange}
              value={data.address}
              required
              className={styles.input}
              aria-describedby="addressHelp"
            />
            <button type="submit" className={styles.green_btn}>
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
