import React, { useState } from 'react';
import AuthContext from '../../context/auth-context';
import './Auth.css';

const AuthPage = () => {
    [isLogin, setIsLogin] = useState(true);

    static contextType = AuthContext;

    const emailElement = React.createRef();
    const passwordElement = React.createRef();

    handleSwitch = () => {
        setIsLogin(!isLogin);

        this.setState(prevState => {
            return { isLogin: !prevState.isLogin }
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const email = emailElement.current.value;
        const password = passwordElement.current.value;

        if (email.trim().length === 0 || password.trim().length === 0 ){
            return;
        }

        let requestBody = {
            query: `
                query Login($email: String!, $password: String!) {
                    login(email: $email, password: $password) {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `,
            variables: {
                email,
                password
            }
        };

        if (!this.state.isLogin){
            requestBody = {
                query: `
                    mutation CreateUser($email: String!, $password: String!){
                        createUser(userInput: { email: $email, password: $password }){
                            _id
                            email
                        }
                    }
                `,
                variables: {
                    email,
                    password
                }
            };
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201){
                throw new Error('Mutation failed');
            }
            return res.json();
        })
        .then(resJSON => {
            if (resJSON.data.login.token){
                this.context.login(
                    resJSON.data.login.token, 
                    resJSON.data.login.userId,
                    resJSON.data.login.tokenExpiration
                )
            }
        })
        .catch(err => {
            console.log(err);
        });
    };

    render() {
        return <form className='auth-form' onSubmit={this.handleSubmit}>
            <div className='form-control'>
                <label htmlFor='email'>Email: </label>
                <input type='email' id='email' ref={this.emailElement}/>
            </div>
            <div className='form-control'>
                <label htmlFor='password'>Password:</label>
                <input type='password' id='password'ref={this.passwordElement}/>
            </div>
            <div className='form-actions'>
                <button type='submit'>Submit</button>                
                <button type='button' onClick={this.handleSwitch}>
                    Switch to { this.state.isLogin ? 'Signup' : 'Login' }
                </button>
            </div>
        </form>
    }
}

export default AuthContainer;