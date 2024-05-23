import React, { useEffect, useState } from 'react';
import { Grid, Box, Paper, Container, FormControl, InputLabel, Select, MenuItem, Typography, IconButton, Button, Card, CardContent, CardActions, CardMedia, Modal } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BathtubIcon from '@mui/icons-material/Bathtub';
import KingBedIcon from '@mui/icons-material/KingBed';
import { apiClient } from '../api/ApiClient';
import PaginationComponent from './PaginationComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';

const HomePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { pageNo, sortBy } = queryString.parse(location.search);

    const [properties, setProperties] = useState([]);
    const [totalPages, setTotalPages] = useState(5); // Adjust this value based on your API response
    const [openModal, setOpenModal] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState(null);

    const userId = parseInt(localStorage.getItem("user_id"));

    const fetchData = () => {
        console.log("Fetching properties...");
        console.log("page no = " + pageNo);

        apiClient.get('/properties/all', {
            params: {
                pageNo: (pageNo - 1 || 0),
                sortBy: sortBy || ''
            }
        })
            .then(response => {
                console.log("Response:", response.data);
                if (Array.isArray(response.data.properties)) {
                    setProperties(response.data.properties);
                    setTotalPages(response.data.totalPages); // Adjust based on API response
                } else {
                    console.error('API response is not an array:', response.data);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the properties!', error);
            });
    };

    useEffect(() => {
        fetchData(); // Fetch data on component mount or when query parameters change
    }, [location.search]);

    const handleSortChange = (event) => {
        navigateToUpdatedQuery({ sortBy: event.target.value });
    };

    const navigateToUpdatedQuery = (updatedParams) => {
        const currentParams = queryString.parse(location.search);
        const newParams = { ...currentParams, ...updatedParams, pageNo: 1 }; // Reset to first page on sort change
        navigate({ search: queryString.stringify(newParams) });
    };


    const sendEmail = (ownerId) => {

        apiClient.post('/send-email', null, {
            params: {
                userId: userId,
                ownerId: ownerId
            }
        })
            .then((response) => {
                console.log('Email sent Successfully', response.data);
            })
            .catch((error) => {
                console.error('There was an error while sending Email!', error);
            });

    }



    const handleInterested = (property) => {

        if(localStorage.getItem("user_id")===null){
            navigate("/login")
            return;
        } 


        apiClient.post('/properties/apply', null, {
            params: {
                userId: userId,
                propertyId: property.id
            }
        })
            .then((response) => {
                sendEmail(property.owner.id);
                setSelectedOwner(property.owner);
                setOpenModal(true);
                console.log('Property applied successfully', response.data);
                fetchData(); // Refresh data after applying
            })
            .catch((error) => {
                console.error('There was an error applying for the property!', error);
            });




        console.log(`User is interested in property with ID: ${property.id}`);
    };

    const handleLike = (propertyId) => {

        if(localStorage.getItem("user_id")===null){
            navigate("/login")
            return;
        } 

        const property = properties.find(prop => prop.id === propertyId);
        if (hasLiked(property)) {
            apiClient.post('/properties/unlike', null, {
                params: {
                    userId: userId,
                    propertyId: propertyId
                }
            })
                .then((response) => {
                    console.log('Property unliked successfully', response.data);
                    fetchData(); // Refresh data after unliking
                })
                .catch((error) => {
                    console.error('There was an error unliking the property!', error);
                });
        } else {
            apiClient.post('/properties/like', null, {
                params: {
                    userId: userId,
                    propertyId: propertyId
                }
            })
                .then((response) => {
                    console.log('Property liked successfully', response.data);
                    fetchData(); // Refresh data after liking
                })
                .catch((error) => {
                    console.error('There was an error liking the property!', error);
                });
        }

        console.log(`User liked/unliked property with ID: ${propertyId}`);
    };

    const hasLiked = (property) => {
        return property.likedUsers.includes(userId);
    };

    const isApplied = (property) => {
        return property.appliedUsers.includes(userId);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedOwner(null);
    };

    return (
        <div>
            <Container maxWidth="lg">
                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item xs={3}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6">Filters</Typography>
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel id="sort-by-label">Sort By</InputLabel>
                                <Select
                                    labelId="sort-by-label"
                                    id="sort-by"
                                    value={sortBy || ''}
                                    label="Sort By"
                                    onChange={handleSortChange}
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    <MenuItem value="likes">Likes</MenuItem>
                                    <MenuItem value="rent">Rent</MenuItem>
                                </Select>
                            </FormControl>
                        </Paper>
                    </Grid>
                    <Grid item xs={9}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">Properties</Typography>
                            <PaginationComponent totalPages={totalPages} currentPage={pageNo || 1} />
                        </Box>
                        <Grid container spacing={3}>
                            {properties.map((property) => (
                                <Grid item xs={12} sm={6} md={4} key={property.id}>
                                    <Card>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={`data:image/png;base64, ${property.propertyImage}` || 'https://placehold.co/400'}
                                            alt={property.rent}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                ₹{property.rent} / month
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <LocationOnIcon fontSize="small" /> {property.area}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <KingBedIcon fontSize="small" /> {property.bedrooms} Bedrooms
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <BathtubIcon fontSize="small" /> {property.bathrooms}
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            {property.owner.id === userId ? (
                                                <Button size="small">You are the Owner</Button>
                                            ) : isApplied(property) ? (
                                                <Button size="small">Already Applied</Button>
                                            ) : (
                                                <Button size="small" onClick={() => handleInterested(property)}>Interested</Button>
                                            )}
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography>{property.likedUsers.length}</Typography>
                                                <IconButton
                                                    aria-label="add to favorites"
                                                    onClick={() => handleLike(property.id)}
                                                >
                                                    <FavoriteIcon color={hasLiked(property) ? "error" : "inherit"} />
                                                </IconButton>
                                            </Box>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="owner-modal-title"
                aria-describedby="owner-modal-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                    <Typography id="owner-modal-title" variant="h6" component="h2">
                        Owner Details
                    </Typography>
                    {selectedOwner && (
                        <Box id="owner-modal-description" sx={{ mt: 2 }}>
                            <Typography>Name: {selectedOwner.firstName + " " + selectedOwner.lastName}</Typography>
                            <Typography>Email: {selectedOwner.email}</Typography>
                            <Typography>Phone: {selectedOwner.phoneNumber}</Typography>
                        </Box>
                    )}
                    <Typography variant="body1" sx={{ mt: 2, fontStyle: 'italic', color: 'green' }}>
                        Owner details have been sent to your email.
                    </Typography>
                </Box>
            </Modal>

        </div>
    );
};

export default HomePage;
