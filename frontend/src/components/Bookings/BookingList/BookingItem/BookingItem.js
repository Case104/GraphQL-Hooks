import React from 'react';
import './BookingItem.css';

const BookingItem = (props) => (
    <li className='booking_item' key={props.bookingId}>
        <div className='booking_item-data'>
            {props.title} -{' '} 
            {new Date(props.createdAt).toLocaleDateString()}
        </div>
        <div booking_item_action>
            <button className='btn' onClick={this.props.handleDeleteBooking.bind(this, props.bookingId)}>Cancel</button>
        </div>
    </li>
);

export default BookingItem;