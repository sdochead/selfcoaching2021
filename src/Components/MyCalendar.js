import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import React from 'react';


export default function MyCalendar() {

    console.log("my cal. component");

    return(
            <>
            {console.log("my cal. xx component")}
                <Calendar defaultView="month" defaultValue={new Date(2022, 1, 1)}/>
            </>

        )
}