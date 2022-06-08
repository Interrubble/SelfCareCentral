import React, { useState, useEffect, useCallback } from 'react';
import './sleep.css';
import { Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API from "../../../utils/API.js"
import SleepCard from "./SleepCard"

export default function Sleep({ token, weekArray, goalObj, isLoggedIn }) {
    const [thisWeek, setThisWeek] = useState([]);
    const [sleepFormObject, setSleepFormObject] = useState({
        date: '',
        time_asleep: '',
        diff_falling_asleep: '',
        diff_staying_asleep: '',
        mood_upon_wake: ''
    })
    const [updateReq, setUpdateReq] = useState('');
    const [existingItem, setExistingItem] = useState('');
    
    useEffect(() => {
        API.getUserSleep(token).then((userData) => {
            console.log(userData)
            const sleepArray = [];
            weekArray.map(entry => {
                var response = userData.find(data => data.date === entry);
                console.log(response)

                let newObj = { date: entry }

                if (response === undefined) {
                    newObj.status = 'Not Reported';
                } else {
                    const { id, date, time_asleep, diff_falling_asleep, diff_staying_asleep, mood_upon_wake } = response;

                    newObj.id = id;
                    newObj.time_asleep = time_asleep;
                    newObj.mood_upon_wake = mood_upon_wake;
                    if (diff_falling_asleep === true) {
                        newObj.diff_falling_asleep = 'true'
                    } else {
                        newObj.diff_falling_asleep = 'false'
                    }
                    if (diff_staying_asleep === true) {
                        newObj.diff_staying_asleep = 'true'
                    } else {
                        newObj.diff_staying_asleep = 'false'
                    }
                    console.log(newObj)
                }
                sleepArray.push(newObj);
            })
            console.log(sleepArray)
            sleepArray[0].day = 'Monday';
            sleepArray[1].day = 'Tuesday';
            sleepArray[2].day = 'Wednesday';
            sleepArray[3].day = 'Thursday';
            sleepArray[4].day = 'Friday';
            sleepArray[5].day = 'Saturday';
            sleepArray[6].day = 'Sunday';
            setThisWeek(sleepArray)
        })
    }, [token, updateReq])

    useEffect(() => {
        API.getOneUserSleep(token, sleepFormObject.date).then((res) => {
            console.log(res)
            if (res.id) {
                setSleepFormObject({
                    date: res.date,
                    time_asleep: res.time_asleep,
                    diff_falling_asleep: res.diff_falling_asleep,
                    diff_staying_asleep: res.diff_staying_asleep,
                    mood_upon_wake: res.mood_upon_wake
                })
                setExistingItem(true);
            } else {
                setExistingItem(false);
            }
        })
    }, [sleepFormObject.date])

    const sendUpdate = useCallback(async (e) => {
        e.preventDefault();
        await API.updateSleepEntry(token, sleepFormObject).then((res) => {
            console.log(res);
            console.log('Sleep entry updated')
            setUpdateReq(true)
        })
        setSleepFormObject({
            date: '',
            time_asleep: '',
            diff_falling_asleep: '',
            diff_staying_asleep: '',
            mood_upon_wake: ''
        })
        setUpdateReq(false)
    })

    const sendCreate = useCallback(async (e) => {
        e.preventDefault();
        await API.postSleepEntry(token, sleepFormObject).then((res) => {
            console.log(res);
            console.log('Sleep entry created')
            setUpdateReq(true)
        })
        setSleepFormObject({
            date: '',
            time_asleep: '',
            diff_falling_asleep: '',
            diff_staying_asleep: '',
            mood_upon_wake: ''
        })
        setUpdateReq(false)
    })

    const sendDelete = useCallback(async (e) => {
        e.preventDefault();
        await API.deleteSleepEntry(token, sleepFormObject.date).then((response) => {
            console.log(response)
            setUpdateReq(true)
        })
        setSleepFormObject({
            date: '',
            time_asleep: '',
            diff_falling_asleep: '',
            diff_staying_asleep: '',
            mood_upon_wake: ''
        })
        setUpdateReq(false)
    })

    return (
        <Card className="sleep">
            {!isLoggedIn ? (
                <h2><Link class="link-light" to='/login'>Login</Link></h2>
            ) : (
                <>
            <h1>Sleep</h1>
            <h2>Your Goals</h2>
            {goalObj.sleep_time != 0 && (
                <h4 className=''>Your nightly sleep goal is {goalObj.sleep_time} hours.</h4>
            )}
            <h2>Report Sleep Data</h2>
            <Form className='sleepForm'>
                <Form.Label htmlFor='formDate'>Date</Form.Label>
                <Form.Check
                    className='sleepInput'
                    value={sleepFormObject.date}
                    type="date"
                    id="formDate"
                    name="formDate"
                    onChange={(e) => setSleepFormObject({ ...sleepFormObject, date: e.target.value })}
                />
                <Form.Label htmlFor='formTime'>How long did you sleep?</Form.Label>
                <Form.Check
                    className='sleepInput'
                    value={sleepFormObject.time_asleep}
                    type="number"
                    min='0'
                    max='24'
                    id="formTime"
                    onChange={(e) => setSleepFormObject({ ...sleepFormObject, time_asleep: e.target.value })}
                    placeholder="8 hours"
                />
                <Form.Label htmlFor='formDiffFall'>Did you have difficulty falling asleep?</Form.Label>
                <Form.Select
                    className='sleepInput'
                    value={sleepFormObject.diff_falling_asleep}
                    type="boolean"
                    id="formDiffFall"
                    name="formDiffFall"
                    onChange={(e) => setSleepFormObject({ ...sleepFormObject, diff_falling_asleep: e.target.value })}
                    placeholder="true/false"
                >
                    <option disabled={true} value=''>Select an option</option>
                    <option className="sleepOption" value={true}>Yes</option>
                    <option className="sleepOption" value={false}>No</option>
                </Form.Select>
                <Form.Label htmlFor='formDiffStay'>Did you have difficulty staying asleep?</Form.Label>
                <Form.Select
                    className='sleepInput'
                    value={sleepFormObject.diff_staying_asleep}
                    type="boolean"
                    id="formDiffStay"
                    name="formDiffStay"
                    onChange={(e) => setSleepFormObject({ ...sleepFormObject, diff_staying_asleep: e.target.value })}
                    placeholder="true/false"
                >
                    <option disabled={true} value=''>Select an option</option>
                    <option className="sleepOption" value={true}>Yes</option>
                    <option className="sleepOption" value={false}>No</option>
                </Form.Select>
                <Form.Label htmlFor='formMood'>How did you feel when you woke up?</Form.Label>
                <Form.Check
                    className='sleepInput'
                    value={sleepFormObject.mood_upon_wake}
                    type="text"
                    id="formMood"
                    name="formMood"
                    onChange={(e) => setSleepFormObject({ ...sleepFormObject, mood_upon_wake: e.target.value })}
                    placeholder="Rested"
                />
                {(existingItem == true) ? (
                    <>
                        <Button type="button" className="sleepBtn"
                            onClick={sendUpdate}>Update</Button>
                        <Button type="button" className="sleepBtn"
                            onClick={sendDelete}>Delete</Button>
                    </>
                ) : (
                    <Button className="sleepBtn" type="button" onClick={sendCreate}>Submit</Button>
                )}
            </Form>
            <h2> This week's sleep reporting:</h2>
            <SleepCard
                name='sleep'
                results={thisWeek} />
                </> 
            )}
        </Card>
    );
}
