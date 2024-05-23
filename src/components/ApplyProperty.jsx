import React, { useState } from 'react';
import axios from 'axios';
import { apiClient } from '../api/ApiClient';

const ApplyProperty = () => {
    const [userId, setUserId] = useState('');
    const [propertyId, setPropertyId] = useState('');

    const handleApply = (e) => {
        e.preventDefault();
        apiClient.post('/properties/apply', null, {
            params: {
                userId: userId,
                propertyId: propertyId
            }
        })
        .then((response) => {
            console.log('Property applied successfully', response.data);
        })
        .catch((error) => {
            console.error('There was an error applying for the property!', error);
        });
    };

    return (
        <form onSubmit={handleApply}>
            <input 
                type="number" 
                placeholder="User ID" 
                value={userId} 
                onChange={(e) => setUserId(e.target.value)} 
                required 
            />
            <input 
                type="number" 
                placeholder="Property ID" 
                value={propertyId} 
                onChange={(e) => setPropertyId(e.target.value)} 
                required 
            />
            <button type="submit">Apply for Property</button>
        </form>
    );
};

export default ApplyProperty;
