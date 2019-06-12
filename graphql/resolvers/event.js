const { formatEvent } = require('./helpers');
const Event = require('../../models/event');
const User = require('../../models/user');

module.exports = {
    events: async () => { 
        try {            
            const events = await Event.find()
            return events.map(event => {
                return formatEvent(event);
            });
        } catch(err){ 
            throw err;
        }
    },
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "sthing"
        });
        let createdEvent;
        try {
            const savedEventResult = await event.save();
            createdEvent = formatEvent(savedEventResult);
            const creator = await User.findById('');
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