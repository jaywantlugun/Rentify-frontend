import React, { useEffect, useState } from 'react';
import { Box, Button, Container, TextField, Typography, Paper, Grid } from '@mui/material';
import { apiClient } from '../api/ApiClient';

const UserProperties = () => {
    const [properties, setProperties] = useState([]);
    const [editing, setEditing] = useState(null);
    const [editData, setEditData] = useState({});
    const ownerId = localStorage.getItem('user_id');

    useEffect(() => {
        apiClient.get(`/properties/user/${ownerId}`)
            .then(response => {
                setProperties(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the properties!', error);
            });
    }, [ownerId]);

    const handleEditClick = (property) => {
        setEditing(property.id);
        setEditData(property);
    };

    const handleCancelClick = () => {
        setEditing(null);
        setEditData({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData({
            ...editData,
            [name]: value,
        });
    };

    const handleSaveClick = (id) => {
        apiClient.put(`/properties/update`, editData)
            .then(response => {
                setProperties(properties.map(property => property.id === id ? response.data : property));
                setEditing(null);
                setEditData({});
            })
            .catch(error => {
                console.error('There was an error updating the property!', error);
            });
    };

    const handleDeleteClick = (id) => {
        apiClient.delete('/properties/delete', {
            params: { propertyId: id }
        })
        .then((response) => {
            console.log('Property deleted successfully', response.data);
            setProperties(properties.filter(property => property.id !== id)); // Update state to remove the deleted property
        })
        .catch((error) => {
            console.error('There was an error deleting the property!', error);
        });

        console.log(`User deleted property with ID: ${id}`);
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                My Properties
            </Typography>
            <Grid container spacing={2}>
                {properties.map(property => (
                    <Grid item xs={12} md={6} key={property.id}>
                        <Paper elevation={3} sx={{ padding: 2 }}>
                            <img src={`data:image/png;base64, ${property.propertyImage}`} alt={property.rent} style={{ maxWidth: '100%', marginBottom: '8px' }} />
                            {editing === property.id ? (
                                <Box component="form" sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <TextField
                                        label="Rent"
                                        name="rent"
                                        type="number"
                                        value={editData.rent || ''}
                                        onChange={handleChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Area"
                                        name="area"
                                        value={editData.area || ''}
                                        onChange={handleChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Bedrooms"
                                        name="bedrooms"
                                        type="number"
                                        value={editData.bedrooms || ''}
                                        onChange={handleChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Bathrooms"
                                        name="bathrooms"
                                        type="number"
                                        value={editData.bathrooms || ''}
                                        onChange={handleChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Nearby Spots"
                                        name="nearbySpots"
                                        value={editData.nearbySpots || ''}
                                        onChange={handleChange}
                                        margin="normal"
                                    />
                                    {/* Add more text fields for other details */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                        <Button onClick={() => handleSaveClick(property.id)} variant="contained" color="primary">
                                            Save
                                        </Button>
                                        <Button onClick={handleCancelClick} variant="outlined" color="secondary">
                                            Cancel
                                        </Button>
                                    </Box>
                                </Box>
                            ) : (
                                <>
                                    <Typography variant="h6">Rent: ₹{property.rent} / month</Typography>
                                    <Typography>Area: {property.area}</Typography>
                                    <Typography>Bedrooms: {property.bedrooms}</Typography>
                                    <Typography>Bathrooms: {property.bathrooms}</Typography>
                                    <Typography>Nearby Spots: {property.nearbySpots}</Typography>
                                    {/* Display more property details */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                        <Button onClick={() => handleEditClick(property)} variant="outlined" color="primary">
                                            Edit
                                        </Button>
                                        <Button onClick={() => handleDeleteClick(property.id)} variant="outlined" color="error">
                                            Delete
                                        </Button>
                                    </Box>
                                </>
                            )}
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default UserProperties;
