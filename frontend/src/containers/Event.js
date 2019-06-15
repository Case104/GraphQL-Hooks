import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import EventList from '../components/Events/EventList/EventList';
import Loading from '../components/Loading/Loading';

import './Event.css'
import AuthContext from '../context/auth-context';

class EventContainer extends Component {
    constructor(props){
        super(props);
        this.titleElement = React.createRef();
        this.priceElement = React.createRef();       
        this.dateElement = React.createRef();      
        this.descriptionElement = React.createRef();                 
    }

    state = {
        creating: false,
        events: [],
        isLoading: false,
        selectedEvent: null
    }

    static contextType = AuthContext;

    componentDidMount(){
        this.getEvents();
    }

    getEvents(){
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
                query {
                    events {
                        _id
                        title
                        description
                        price
                        date
                        creator {
                            _id
                            email
                        }
                    }
                }
            `
        }
        return fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201){
                throw new Error('Query failed');
            }
            return res.json();
        })
        .then(resJSON => {
            const { events } = resJSON.data;
            this.setState({ events, isLoading: false });
        })
        .catch(err => {
            console.log(err);
            this.setState({ isLoading: false });
        });
    }

    handleModalLaunch = () => {
        this.setState({ creating: true });
    }

    handleModalConfirm = (event) => {
        this.setState({ creating: false });
        const title = this.titleElement.current.value;
        const price = +this.priceElement.current.value; 
        const date = this.dateElement.current.value;
        const description = this.descriptionElement.current.value;               

        if (
            title.trim().length === 0 || 
            price <= 0 || 
            date.trim().length === 0 || 
            description.trim().length === 0
        ) {
            return;
        }

        const requestBody = {
            query: `
                mutation {
                    createEvent(eventInput: {
                        title: "${title}", 
                        description: "${description}", 
                        price: ${price},
                        date: "${date}"
                    }) {
                        _id
                        title
                        description
                        date
                        price
                    }
                }
            `
        }

        const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201){
                throw new Error('Mutation failed');
            }
            return res.json();
        })
        .then(resJSON => {
            const { _id, title, description, date, price } = resJSON.data.createEvent;
            this.setState(prevState => {
                return { 
                    events: [...prevState.events, 
                        { 
                            _id, 
                            title, 
                            description, 
                            date, 
                            price,
                            creator: {
                                _id: this.context.userId
                            }
                        }
                    ] 
                }
            });
        })
        .catch(err => {
            console.log(err);
        });
    }

    handleModalCancel = () => {
        this.setState({ creating: false, selectedEvent: null });
    }

    handleEventDetail = eventId => {
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(event => { return event._id === eventId });
            return { selectedEvent };
        })
    }

    handleBookEvent = () => {

    }

    render() {
        return (
            <React.Fragment>
                { (this.state.creating || this.state.selectedEvent) && <Backdrop /> }
                { this.state.creating && (
                    <Modal 
                        title='Add Event' 
                        canCancel 
                        canConfirm 
                        onCancel={this.handleModalCancel} 
                        onConfirm={this.handleModalConfirm}
                        confirmText="Confirm"
                    >
                        <form onSubmit={this.onConfirm}>
                            <div className='form-control'>
                                <label htmlFor='title'>Title: </label>
                                <input type='text' id='title' ref={this.titleElement}/>
                            </div>
                            <div className='form-control'>
                                <label htmlFor='price'>Price:</label>
                                <input type='number' id='price'ref={this.priceElement}/>
                            </div> 
                            <div className='form-control'>
                                <label htmlFor='date'>Date:</label>
                                <input type='datetime-local' id='date' ref={this.dateElement}/>
                            </div>                                                            
                            <div className='form-control'>
                                <label htmlFor='description'>Description:</label>
                                <textarea id='description' rows='4' ref={this.descriptionElement}/>
                            </div>                       
                        </form>
                    </Modal>
                )}
                { this.state.selectedEvent && (
                    <Modal 
                        title={this.state.selectedEvent.title} 
                        canCancel 
                        canConfirm 
                        onCancel={this.handleModalCancel} 
                        onConfirm={this.handleBookEvent}
                        confirmText='Book'
                    >
                       <h1>{ this.state.selectedEvent.title }</h1>
                       <h2>
                           { this.props.price } - { new Date(this.state.selectedEvent.date).toLocaleDateString() }
                       </h2>
                       <p>{ this.state.selectedEvent.description }</p>
                    </Modal>                
                )}
                { this.context.token && (
                    <div className='events-control'>
                        <p>Create a new event!</p>
                        <button className='btn' onClick={this.handleModalLaunch}>Create Event</button>
                    </div>
                )}
                { this.state.isLoading ? 
                    <Loading /> :
                    <EventList 
                        events={this.state.events} 
                        userId={this.context.userId} 
                        handleEventDetail={this.handleEventDetail}
                    />
                }
            </React.Fragment>
        );
    }
}

export default EventContainer;