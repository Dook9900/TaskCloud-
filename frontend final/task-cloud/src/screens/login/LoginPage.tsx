import React from 'react'
import SignIn from '../../components/LoginForm/LoginForm';
import styles from './_loginPage.module.css'

const LoginPage = () => {
  return (
    <div className={styles.loginContainer}>
        <SignIn />

      {/* Link to SignUpPage */}
      <div className={styles.signUpLink}>
      </div>
    </div>
  )
}

export default LoginPage