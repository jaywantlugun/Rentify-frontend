import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/ApiClient';

const PropertyForm = () => {
    const [formData, setFormData] = useState({
        rent: '', // Updated state initialization
        area: '',
        bedrooms: '',
        bathrooms: '',
        nearbySpots: '',
        ownerId: localStorage.getItem('user_id') || '',
        file: null,
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'file') {
            setFormData({
                ...formData,
                [name]: files[0],
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        apiClient.post('/properties/add', data)
            .then((response) => {
                console.log('Property added successfully', response.data);
                navigate('/');
            })
            .catch((error) => {
                console.error('There was an error adding the property!', error);
            });
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" align="center" gutterBottom>
                Add Property
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <TextField
                    type="number" // Change input type to 'number'
                    name="rent" // Change name to 'rent'
                    label="Rent" // Change label to 'Rent'
                    variant="outlined"
                    value={formData.rent} // Update value to formData.rent
                    onChange={handleChange} // Update onChange handler
                    required
                />
                <TextField
                    type="text"
                    name="area"
                    label="Area"
                    variant="outlined"
                    value={formData.area}
                    onChange={handleChange}
                    required
                />
                <TextField
                    type="number"
                    name="bedrooms"
                    label="Bedrooms"
                    variant="outlined"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    required
                />
                <TextField
                    type="number"
                    name="bathrooms"
                    label="Bathrooms"
                    variant="outlined"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    required
                />
                <TextField
                    type="text"
                    name="nearbySpots"
                    label="Nearby Spots"
                    variant="outlined"
                    value={formData.nearbySpots}
                    onChange={handleChange}
                />
                <TextField
                    type="number"
                    name="ownerId"
                    label="Owner ID"
                    variant="outlined"
                    value={formData.ownerId}
                    onChange={handleChange}
                    required
                    disabled
                />
                <input type="file" name="file" onChange={handleChange} required />
                <Button type="submit" variant="contained" color="primary">
                    Add Property
                </Button>
            </Box>
        </Container>
    );
};

export default PropertyForm;
