import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig)

function App() {

  const [newUser, setNewUser] = useState(false)
  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    success: false

  })

  // Login Section Start

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth()
      .signInWithPopup(provider)
      .then(res => {
        const { displayName, email, photoURL } = res.user
        const isSignInLogIn = {
          isSignIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(isSignInLogIn)
        console.log(isSignInLogIn);

      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })

  }

  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const isSignInLogOut = {
          isSignIn: false,
          name: '',
          email: '',
          photo: ''
        }
        setUser(isSignInLogOut)
        console.log('Log Out successfully Done!!!');
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })

  }


  const handleBlur = (event) => {
    let isFormValid = true;

    // Email Validation 

    if (event.target.name === 'email') {
      isFormValid = /\S+@\S+\.\S+/.test(event.target.value)

    }

    // Password Validation 

    if (event.target.name === 'password') {
      const isPaaswordValid = event.target.value.length > 6;
      const paswordNumberValid = /\d{1}/.test(event.target.value)
      isFormValid = (isPaaswordValid && paswordNumberValid);
    }
    if (isFormValid) {
      const newUserInfo = { ...user }
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo)
    }

  }


  const handleSubmit = (event) => {

    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUserInfo = { ...user }
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo)
          userUpdateInfo(user.name)
        })
        .catch((error) => {
          const newUserInfo = { ...user }
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo)
        });

    }
    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUserInfo = { ...user }
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo)
          console.log('Update Name', res.user);
        })
        .catch((error) => {
          const newUserInfo = { ...user }
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo)
        });
    }

    event.preventDefault();
  }

  const userUpdateInfo = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name
    }).then(function () {
      console.log('Update successful')
    }).catch(function (error) {
      console.log(error);
    });
  }



  return (
    <div className="App">

      {
        user.isSignIn ? <button onClick={handleSignOut}>Sign out</button>
          : <button onClick={handleSignIn}>Sign in</button>
      }

      {
        user.isSignIn && <div>
          <h2>Name: {user.name} </h2>
          <p>Email: {user.email} </p>
          <img src={user.photo} alt="photo" />
        </div>
      }

      {/* Sign Up Section */}

      <div className="signup">
        <form onSubmit={handleSubmit}>
          <h1>SignUp Form</h1>

          {/* <div>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Password: {user.password}</p>
          </div> */}

          {newUser && < input type="text" name="name" onBlur={handleBlur} className="form-control" placeholder="Enter Your Name..." />}

          <input type="text" name="email" onBlur={handleBlur} className="form-control" placeholder="Enter Your Email..." required />
          <input type="password" name="password" onBlur={handleBlur} className="form-control" placeholder="Enter Your Password..." required />
          <input type="submit" className="btn btn-primary" value={newUser ? 'Sign up' : 'Sign in'} />

        </form>

        <input type="checkbox" name="newUser" onChange={() => setNewUser(!newUser)} />
        <label htmlFor="newUser">New Registration</label>

        <p style={{ color: 'red' }} > {user.error} </p>
        {
          user.success && <p style={{ color: 'green' }}> User {newUser ? 'Created' : 'Logged In'}  Successfully! </p>
        }

      </div>

    </div>
  );
}

export default App;
