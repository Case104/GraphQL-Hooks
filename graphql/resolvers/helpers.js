const { formatReadableDate } = require('../../helpers/date');

const User = require('../../models/user');
const Event = require('../../models/event');


export const formatEvent = event => {
    return { 
        ...event._doc, 
        _id: event.id, 
        date: formatReadableDate(event._doc.date),
        creator: user.bind(this, event.creator)
    };
};

export const formatBooking = booking => {
    return {
        ...savedBooking._doc,
        _id: savedBooking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),                
        createdAt: formatReadableDate(savedBooking._doc.createdAt),
        updatedAt: formatReadableDate(savedBooking._doc.updatedAt)
    };
};

const user = async userId => {
    try {
        const user = await User.findById(userId)
        return { 
            ...user._doc, 
            _id: user.id, 
            createdEvents: events.bind(this, user._doc.createdEvents) 
        };        
    } catch(err) {
        throw err;
    }
};

const singleEvent = async eventId => {
    try {
        return formatEvent(await Event.findById(eventId));
    } catch(err) {
        throw err;
    }
}

const events = async eventIds => {
    try {
        const events = await Event.find({_id: {$in: eventIds}})
        return events.map(event => {
            return formatEvent(event);
        })        
    } catch(err) {
        throw err;
    }
}