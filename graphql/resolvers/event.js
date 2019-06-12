const { formatEvent } = require('./helpers');
const Event = require('../../models/event');
const User = require('../../models/user');

module.exports = {
    events: async () => { 
        try {            
            const events = await Event.find()
            return events.map(formatEvent);
        } catch(err){ 
            throw err;
        }
    },
    createEvent: async ({ eventInput: { title, description, price, date }}, req) => {
        if (!req.isAuth){
            throw new Error('Unauthenticated user')
        }
        const event = new Event({
            title,
            description,
            price: +price,
            date: new Date(date),
            creator: req.userId
        });
        let createdEvent;
        try {
            const savedEventResult = await event.save();
            createdEvent = formatEvent(savedEventResult);
            const creator = await User.findById(req.userId);
            if (!creator){
                throw new Error(`User not found.`);
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        } catch(err) { 
            console.log("Error in createEvent:", error);
            throw err;
        }
    }
};