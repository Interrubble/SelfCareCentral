import React, { useState, useEffect } from 'react';
import "./profile.css"
import API from "../../../utils/API.js"

export default function Profile({token}) {
    const [goalObj, setGoalObj] = useState({
        id: '',
        fitness_time:'',
        fitness_frequency:'',
        sleep_time: '',
        hydration_oz: ''
    })

    useEffect(() => {
        API.getUserGoals(token).then((userData)=>{
        console.log(userData)
        const { fitness_time, fitness_frequency, sleep_time, hydration_oz, id } = userData[0];
        setGoalObj({
            id,
            fitness_time,
            fitness_frequency,
            sleep_time,
            hydration_oz
        })
        })
    }, [token])

    const handleFormSubmit = (e) => {
        e.preventDefault();
        window.location.href = "/dashboard"
    }

    useEffect(() => {
        API.updateGoals(token, goalObj).then((res) => {
        console.log(res)
    })
    }, [goalObj])

    return (
        <div className='profilePage'>
            <h1>Tell us about yourself</h1>
            <form className="profileForm" onSubmit={handleFormSubmit}>
                <div className='formGroup'>
                    <label> I want to exercise </label>
                    <input
                        className='input'
                        value={goalObj.fitness_time}
                        name="fitnessTimeGoal"
                        type="number"
                        min="0"
                        max="10000"
                        onChange={(e) => setGoalObj({...goalObj, fitness_time: e.target.value})}
                    />
                    <label> minutes per week! 🏃‍♀️ </label>
                </div>
                <div className='formGroup'>
                    <label>I want to exercise </label>
                    <input
                        className='input'
                        value={goalObj.fitness_frequency}
                        name="fitnessFreqGoal"
                        type="number"
                        min="0"
                        max="7"
                        onChange={(e) => setGoalObj({...goalObj, fitness_frequency: e.target.value})}
                    />
                    <label> days per week! 🚴 </label>
                </div>
                <div className='formGroup'>
                    <label>I want to sleep </label>
                    <input
                        className='input'
                        value={goalObj.sleep_time}
                        name="sleepGoal"
                        type="decimal"
                        min="0"
                        max="24"
                        onChange={(e) => setGoalObj({...goalObj, sleep_time: e.target.value})}
                    />
                    <label> hours per night! 😴 </label>
                </div>
                <div className='formGroup'>
                    <label>I want to drink </label>
                    <input
                        className='input'
                        value={goalObj.hydration_oz}
                        name="hydrationGoal"
                        type="number"
                        min="0"
                        max="1000"
                        onChange={(e) => setGoalObj({...goalObj, hydration_oz: e.target.value})}
                    />
                    <label> ounces of water per day! 💧</label>
                </div>
                <button className='button' type="submit"
                >Submit</button>
            </form>
        </div>
    );
}

