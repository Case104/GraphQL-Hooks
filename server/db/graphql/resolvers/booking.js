const { formatBooking, formatEvent } = require('./helpers');
const Booking = require('../../models/booking');
const Event = require('../../models/event');


module.exports = {
    bookings: async (_, req) => {
        if (!req.isAuth){
            throw new Error('Unauthenticated user')
        }
        try {
            const bookings = await Booking.find({user: req.userId});
            return bookings.map(formatBooking);
        } catch(err) {
            throw err;
        }
    },
    bookEvent: async ({ eventId }, req) => {
        if (!req.isAuth){
            throw new Error('Unauthenticated user')
        }
        try {
            const event = await Event.findOne({ _id: eventId });
            const booking = new Booking({
                event,
                user: req.userId
            });
            return formatBooking(await booking.save());
        } catch(err){ 
            throw err;
        }
    },
    cancelBooking: async (bookingId, req) => {
        if (!req.isAuth){
            throw new Error('Unauthenticated user')
        }
        try {
            const booking = await Booking.findById(bookingId).populate(event);
            const currentEvent = formatEvent(booking.event);
            await Booking.deleteOne({ _id: bookingId });
            return currentEvent;
        } catch(err){
            throw err;
        }
    }
};