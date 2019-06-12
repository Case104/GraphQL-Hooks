const { formatBooking, formatEvent } = require('./helpers');
const Booking = require('../../models/booking');
const Event = require('../../models/event');

module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find()
            return bookings.map(booking => {
                return formatBooking(booking)
            });
        } catch(err) {
            throw err;
        }
    },
    bookEvent: async args => {
        try {
            const bookEvent = Event.findOne({_id: args.eventId});
            const newBooking = new Booking({
                event: bookEvent,
                user: 'giggleshits'
            });
            return formatBooking(await newBooking.save());
        } catch(err){ 
            throw err;
        }
    },
    cancelBooking: async args => {
        try {
            const currentBooking = await Booking.findById(args.bookingId).populate(event);
            const currentEvent = formatEvent(currentBooking.event);
            await Booking.deleteOne({_id: args.bookingId})
            return currentEvent;
        } catch(err){
            throw err;
        }
    }
};