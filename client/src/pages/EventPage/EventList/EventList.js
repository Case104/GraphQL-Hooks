import React from 'react';
import EventItem from '../EventItem/EventItem';
import './EventList.css';

const EventList = props => {
    const events = props.events.map(event => {
        return <EventItem 
                    key={event._id} 
                    eventId={event._id} 
                    title={event.title} 
                    price={event.price}
                    date={event.date}
                    userId={props.userId}
                    creatorId={event.creator._id}
                    handleEventDetail={props.handleEventDetail}
                />
    })
    return <ul className='event_list'>{events}</ul>;
}

export default EventList;