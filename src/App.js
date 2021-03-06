import React, {useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import './components/pages/header/NavTabs';
import Home from './components/pages/Home/Home'
import Dashboard from './components/pages/dashboard/Dashboard';
import Sleep from './components/pages/sleep/Sleep';
import Hydration from './components/pages/hydration/Hydration';
import Mindfulness from './components/pages/mindfulness/Mindfulness';
import Header from './components/pages/header/Header';
import Login from './components/pages/login/Login';
import Profile from './components/pages/Profile/profile'
import API from "./utils/API";
import Exercise from './components/pages/exercise/Exercise';
import 'bootstrap/dist/css/bootstrap.min.css';
import weekArray from "./utils/weekdates";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [goalObj, setGoalObj] = useState({
    id: '',
    fitness_time:'',
    fitness_frequency:'',
    sleep_time: '',
    hydration_oz: ''
})
const [errorMessage, setErrorMessage] = useState('');

// check local storage for token on page load
  useEffect(()=>{
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  // if there is a token, verify it using API route. set isloggedin to true and set user id. 
  useEffect(()=> {
    if(token) {
      API.verify(token)
      .then(userData => {
        if (userData.userId){
          setIsLoggedIn(true);
          setUserId(userData.userId)
        } else {
          setIsLoggedIn(false);
          setUserId(null)
        }
      }).catch((err) => console.log(err))
    } else {
      setIsLoggedIn(false);
      setUserId(null)
    }
  }, [token])

  // on log in, set token in local storage 
  const handleLoginSubmit = (loginData) => {
    API.login(loginData)
    .then(data => {
      console.log(data)
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard"
      } else {
        setErrorMessage('Login failed; please try again.')
      }
    })
    .catch ((err) => console.log(err))
  }

  // on sign up, set token in local storage
  const handleSignupSubmit = (signupData) => {
    API.signup(signupData)
    .then(data => {
      if (data.token) {
        setToken(data.token)
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard"
      } else {
        setErrorMessage('Signup failed; please try again.')
      }
    })
    .catch((err) => console.log(err))
  }

  // logout by removing the token
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  }
  
  // goals are used across all pages. get user goals here to hand as props to other pages. 
  useEffect(() => {
    API.getUserGoals(token)
    .then((userData)=>{
    const { fitness_time, fitness_frequency, sleep_time, hydration_oz, mindfulness_frequency, id } = userData[0];
    setGoalObj({
        id,
        fitness_time,
        fitness_frequency,
        sleep_time,
        hydration_oz,
        mindfulness_frequency
    })
    })
    .catch((err) => console.log(err))
}, [token])

  return (
    <BrowserRouter>
      <Header 
        isLoggedIn={isLoggedIn} 
        userId={userId} 
        logout={logout} 
      />
      <Routes>
        <Route 
          path='/' 
          element={<Home 
            isLoggedIn={isLoggedIn} 
          />} />
        <Route 
          path='/login' 
          element={<Login 
            isLoggedIn={isLoggedIn} 
            signup={handleSignupSubmit} 
            login={handleLoginSubmit} 
            errorMessage={errorMessage}
            />} />
        <Route 
          path='/dashboard' 
          element={<Dashboard 
            isLoggedIn={isLoggedIn} 
            userId={userId} 
            token={token} 
            weekArray={weekArray} 
            />} />
        <Route 
          path='/profile' 
          element={<Profile 
            isLoggedIn={isLoggedIn} 
            userId={userId} 
            token={token}/>} />
        <Route 
          path='/fitness' 
          element={<Exercise 
            isLoggedIn={isLoggedIn} 
            userId={userId} 
            token={token}
            weekArray={weekArray} 
            goalObj={goalObj}
            />} />
        <Route 
          path='/sleep' 
          element={<Sleep 
            isLoggedIn={isLoggedIn} 
            userId={userId} 
            token={token} 
            weekArray={weekArray} 
            goalObj={goalObj}
            />} />
        <Route 
          path='/hydration' 
          element={<Hydration 
            isLoggedIn={isLoggedIn} 
            userId={userId} 
            token={token}
            weekArray={weekArray} 
            goalObj={goalObj}
            />} />
        <Route 
          path='/mindfulness' 
          element={<Mindfulness 
            isLoggedIn={isLoggedIn} 
            userId={userId} 
            token={token} 
            weekArray={weekArray} 
            goalObj={goalObj}/>} />
        <Route 
          path='*' 
          element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
