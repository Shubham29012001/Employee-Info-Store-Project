import { useState, useContext } from 'react';
import styles from './styles.module.css';
import { Link, useNavigate } from 'react-router-dom';
import AuthServices from '../../ApiServices/authServices.js';
import { loginContext } from '../context/contextProvider.js';
import BadgeIcon from '@mui/icons-material/Badge';
import CakeIcon from '@mui/icons-material/Cake';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';
import HomeIcon from '@mui/icons-material/Home';
import Fade from 'react-reveal/Fade';
import { toast } from 'react-toastify';

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

    if (!data.name || !data.dob || !data.email || !data.password || !data.confirmPassword || !data.address) {
      toast.error("Please provide complete input details");
    }
    else if (data.password !== data.confirmPassword) {
      toast.error("Password and Confirm Password are not same");
    }
    else {
      try {
        const { data: res } = await AuthServices.signup(data);
        if (res) {
          toast.success('User Signed Up Successfully');
          localStorage.setItem('userDetails', JSON.stringify(res));
          setloginData(res);
          navigate('/employee');
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
              <div className='input'>
                <BadgeIcon />
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
              </div>
              <div className='input'>
                <CakeIcon />
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
              </div>

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

              <div className='input'>
                <PasswordIcon />

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
              </div>
              <div className='input'>
                <HomeIcon />
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
              </div>
              <button type="submit" className={styles.green_btn}>
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default Signup;
