import { useState, useContext } from 'react';
import styles from './styles.module.css';
import { Link, useNavigate } from 'react-router-dom';
import AuthServices from '../../ApiServices/authServices.js';
import { loginContext } from '../context/contextProvider.js';

const Login = () => {
  const [loginData, setloginData] = useContext(loginContext);
  const history = useNavigate("");
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: res } = await AuthServices.login(data);
      if (res) {
        localStorage.setItem('userDetails', JSON.stringify(res));
        setloginData(res);
        res.userType === 755 ? history('/admin') : history('/dashboard');
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
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Login to Your Account</h1>

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

            <button type="submit" className={styles.green_btn}>
              Login
            </button>
          </form>
        </div>
        <div className={styles.right}>
          <h1>New User?</h1>
          <Link to="/signup">
            <button type="button" className={styles.white_btn}>
              Sign Up
            </button>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Login;
