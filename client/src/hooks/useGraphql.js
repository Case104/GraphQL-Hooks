import { useState } from 'react';

export const useGraphql = ( requestBody, token ) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState(null);

    let headers = { 'Content-Type': 'application/json' };
    if ( token ) { headers['Authorization'] = 'Bearer ' + token; }

    const fetchData = async () => {
        setIsError(false);
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:8000/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers
            })               
            const json = await res.json();    
            setData(json);
        } catch(error) {
            setIsError(error);
        };

        setIsLoading(false);
    }
    fetchData();
    return [{ data, isLoading, isError }, ]
}