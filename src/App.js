import React from "react";
import './App.css';
import './components/NavTabs';
import Home from './components/pages/Home'
import Dashboard from './components/pages/Dashboard';
import Fitness from './components/pages/Fitness';
import Sleep from './components/pages/Sleep';
import Hydration from './components/pages/Hydration';
import Mindfulness from './components/pages/Mindfulness';
import {BrowserRouter,Routes,Route} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/fitness' element={<Fitness/>}/>
            <Route path='/sleep' element={<Sleep/>}/>
            <Route path='/hydration' element={<Hydration/>}/>
            <Route path='/mindfulness' element={<Mindfulness/>}/>
        </Routes>
        </BrowserRouter>
    // <h1>Hello</h1>
  );
}

export default App;
