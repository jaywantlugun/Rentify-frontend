import React from 'react';
import Pagination from '@mui/material/Pagination';
import { useNavigate, useLocation } from 'react-router-dom';

const PaginationComponent = ({ totalPages = 1, currentPage = 1 }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handlePageChange = (event, value) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('pageNo', value);
        navigate(`${location.pathname}?${searchParams.toString()}`);
    };

    return (
        <Pagination
            count={totalPages}
            page={parseInt(currentPage, 10)}
            onChange={handlePageChange}
            color="primary"
        />
    );
};

export default PaginationComponent;
