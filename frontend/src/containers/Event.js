import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import Modal from '../components/Modal/Modal';
import CreateEventForm from '../components/Modal/CreateEventForm/CreateEventForm';
import Backdrop from '../components/Backdrop/Backdrop';
import EventList from '../components/Events/EventList/EventList';
import Loading from '../components/Loading/Loading';
import api from '../utils/api';
import './Event.css'

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
    isActive = true;

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

        return api.makeRequest(requestBody)
        .then(resJSON => {
            const { events } = resJSON.data;
            if (this.isActive){
                this.setState({ events, isLoading: false });
            }
        })
        .catch(err => {
            console.log(err);
            if (this.isActive) {
                this.setState({ isLoading: false });
            }            
        });
    }

    showEventModal = () => {
        this.setState({ creating: true });
    }

    handleCreateEvent = (event) => {
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
                mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!) {
                    createEvent(eventInput: {
                        title: $title, 
                        description: $description, 
                        price: $price,
                        date: $date
                    }) {
                        _id
                        title
                        description
                        date
                        price
                    }
                }
            `,
            variables: {
                title,
                description,
                price,
                date
            }
        };

        return api.makeRequest(requestBody, this.context.token)
        .then(resJSON => {
            const { _id, title, description, date, price } = resJSON.data.createEvent;
            this.setState(prevState => {
                return { 
                    events: [...prevState.events, { 
                        _id, 
                        title, 
                        description, 
                        date, 
                        price,
                        creator: {
                            _id: this.context.userId
                        }
                    }]
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
        if  (!this.context.token) {
            this.setState({ selectedEvent: null });
            return;
        };
        const requestBody = {
            query: `
                mutation BookEvent($id: ID!) {
                    bookEvent(eventId: $id) {
                        _id
                        createdAt
                        updatedAt
                    }
                }
            `,
            variables: {
                id: this.state.selectedEvent._id
            }
        };

        return api.makeRequest(requestBody, this.context.token)
        .then(resJSON => {
            this.setState({ selectedEvent: null });
        })
        .catch(err => {
            console.log(err);
        });
    }

    componentWillUnmount(){
        this.isActive = false;
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
                        onConfirm={this.handleCreateEvent}
                        confirmText='Confirm'
                    >
                        <CreateEventForm 
                            titleRef={this.titleElement}
                            priceRef={this.priceElement}
                            dateRef={this.dateElement}
                            descriptionRef={this.descriptionElement}
                            onConfirm={this.onConfirm}
                        />
                    </Modal>
                )}
                { this.state.selectedEvent && (
                    <Modal 
                        title={this.state.selectedEvent.title} 
                        canCancel 
                        canConfirm 
                        onCancel={this.handleModalCancel} 
                        onConfirm={this.handleBookEvent}
                        confirmText={this.context.token ? 'Book' : 'Confirm'}
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
                        <button className='btn' onClick={this.showEventModal}>Create Event</button>
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