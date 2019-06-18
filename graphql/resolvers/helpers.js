const DataLoader = require('dataloader')
const { formatReadableDate } = require('../../helpers/date');
const User = require('../../models/user');
const Event = require('../../models/event');

exports.formatEvent = event => {
    return { 
        ...event._doc, 
        _id: event.id, 
        date: formatReadableDate(event._doc.date),
        creator: user.bind(this, event.creator)
    };
};

exports.formatBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),                
        createdAt: formatReadableDate(booking._doc.createdAt),
        updatedAt: formatReadableDate(booking._doc.updatedAt)
    };
};

const eventLoader = new DataLoader((eventIds) => {
    return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {
    return User.find({ _id: {$in: userIds} });
})

const user = async userId => {
    try {
        const user = await userLoader.load(userId.toString());
        return { 
            ...user._doc, 
            _id: user.id, 
            createdEvents: () => eventLoader.loadMany(user._doc.createdEvents) 
        };        
    } catch(err) {
        throw err;
    }
};

const singleEvent = async eventId => {
    try {
        const event = await eventloader.load(eventId.toString());
        return event;
    } catch(err) {
        throw err;
    }
}

const events = async eventIds => {
    try {
        const events = await Event.find({_id: {$in: eventIds}})
        console.log(events)
        events.sort((a, b) => {
            return (
                eventIds.indexOf(a.id.toString() - eventIds.indexOf(b.id.toString()))
            );
        });
        console.log('after sort', events)
        return events.map(formatEvent);
    } catch(err) {
        throw err;
    }
}