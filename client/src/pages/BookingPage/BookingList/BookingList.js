import React from 'react';
import BookingItem from '../BookingItem/BookingItem';
import './BookingList.css';

const BookingList = (props) => (
    <ul className='booking_list'>
        { props.bookings.map(booking => {
            return <BookingItem 
                        title={booking.title} 
                        bookingId={booking._id}
                        handleDeleteBooking={props.handleDeleteBooking}
                    />
        })}
    </ul>        
)

export default BookingList;