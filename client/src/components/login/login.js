import { useState, useContext } from 'react';
import styles from './styles.module.css';
import { Link, useNavigate } from 'react-router-dom';
import AuthServices from '../../ApiServices/authServices.js';
import { loginContext } from '../context/contextProvider.js';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';
import Fade from 'react-reveal/Fade';
import { toast } from 'react-toastify';

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
    if (!data.email || !data.password) {
      toast.error("Please provide complete input");
    }
    else {
      try {
        const { data: res } = await AuthServices.login(data);
        if (res) {
          localStorage.setItem('userDetails', JSON.stringify(res));
          setloginData(res);
          toast.success("Login Successfully");
          res.userType === 755 || res.userType === 955 ? history('/admin') : history('/employee');
        }
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          toast.error(error.response.data.msg);
        }
      }
    }
  };

  return (
    <Fade duration={700}>
      <div className={styles.login_container}>
        <div className={styles.login_form_container}>
          <div className={styles.left}>
            <form className={styles.form_container} onSubmit={handleSubmit}>
              <h1>Login to Your Account</h1>
              <div className='input'>
                <EmailIcon />
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
              </div>
              <div className='input'>
                <PasswordIcon />
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
              </div>
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
    </Fade>

  );
};

export default Login;
