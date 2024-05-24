import React from 'react';
import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import DescriptionIcon from '@mui/icons-material/Description';

const FooterComponent = () => {
    return (
        <Box sx={{ bgcolor: 'black', color: 'white', py: 2, mt: 'auto' }}>
            <Container maxWidth="lg">
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} textAlign="center">
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            Developed by Jaywant Lugun
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <IconButton href="mailto:jaywantlugun2000@gmail.com" color="inherit" size="large">
                                <EmailIcon />
                            </IconButton>
                            <Typography variant="h6" noWrap sx={{ mx: '2px' }}>
                                |
                            </Typography>
                            <IconButton href="https://www.linkedin.com/in/jaywant-lugun/" target="_blank" color="inherit" size="large">
                                <LinkedInIcon />
                            </IconButton>
                            <Typography variant="h6" noWrap sx={{ mx: '2px' }}>
                                |
                            </Typography>
                            <IconButton href="https://drive.google.com/file/d/1-5hFzuORS31BPv-VCIaQqHrCjm9nNBPW/view?usp=sharing" target="_blank" color="inherit" size="large">
                                <DescriptionIcon />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default FooterComponent;
