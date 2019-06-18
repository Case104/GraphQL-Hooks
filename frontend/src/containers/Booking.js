import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import BookingList from '../components/Bookings/BookingList/BookingList'
import  Loading from '../components/Loading/Loading';
import api from '../utils/api'


class BookingContainer extends Component {

    state = {
        isLoading: true,
        bookings: []
    };

    static contextType = AuthContext;

    componentDidMount(){
        this.getBookings();
    }

    getBookings = () => {
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
                query {
                    bookings {
                        _id
                        createdAt
                        event {
                            _id
                            title
                            date
                        }
                    }
                }
            `
        }
        return api.makeRequest(requestBody, this.context.token)
        .then(resJSON => {
            const { bookings } = resJSON.data;
            this.setState({ bookings, isLoading: false });
        })
        .catch(err => {
            console.log(err);
            this.setState({ isLoading: false });     
        });
    }

    handleDeleteBooking = bookingId => {
        this.setState({isLoading: true});
        const requestBody = {
            query: `
                mutation CancelBooking($id: ID!){
                    cancelBooking({ bookingID: $id}}){
                        _id
                        title
                    }
                }
            `,
            variables: {
                id: bookingId
            }
        }

        return api.makeRequest(requestBody, this.context.token)
        .then(resJSON => {
            this.setState(prevState => {
                const bookings = prevState.bookings.filter(booking => { 
                    return booking.event._id !== bookingId;
                });
                return { ...prevState, bookings, isLoading: false };
            })
        })
        .catch(err => {
            this.setState({isLoading: false});
            console.log(err);
        })
    }

    render() {
        return (
            <React.Fragment>
            { this.state.isLoading ? <Loading /> : <BookingList bookings={this.state.bookings} handleDeleteBooking={this.handleDeleteBooking}/> }                
            </React.Fragment>
        )
    }
}

export default BookingContainer;