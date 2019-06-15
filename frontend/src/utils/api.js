module.exports = {
    makeRequest: ( requestBody, token = null ) => {
        let headers = {
            'Content-Type': 'application/json'
        }
        if ( token ) {
            headers['Authorization'] = 'Bearer ' + token
        }
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Request failed');
            }
            return res.json();
        })
    }
}
