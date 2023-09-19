import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, useTheme } from "@mui/material";
import { setRecords, setTypes } from "../../state";
import Record from "scenes/widgets/Record";
import FlexBetween from "../../components/FlexBetween";

const RecordHistory = ({ userId, token }) => {
    const dispatch = useDispatch();
    const palette = useTheme().palette;
    const records = useSelector((state) => state.records);
    const types = useSelector((state) => state.types);

    const [isDataFetched, setIsDataFetched] = useState(false);

    const getRecords = async () => {
        const fetchResponse = await fetch(`http://localhost:3002/records/${userId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const resultRecords = await fetchResponse.json();
        dispatch(setRecords({ records: resultRecords }));
    };

    const getTypes = async () => {
        const fetchResponse = await fetch(`http://localhost:3002/records/types/${userId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const resultTypes = await fetchResponse.json();
        dispatch(setTypes({ types: resultTypes }));
    }

    useEffect(() => {
        const fetchData = async () => {
            await getRecords();
            await getTypes();
            setIsDataFetched(true);
        };

        fetchData();
    }, []);

    return (
    <Box
        width="100%"
        height="100%"
    >
        <FlexBetween
            width="100%"
            height="4rem"
            sx={{
                justifyContent: "space-evenly",
                backgroundColor: palette.primary.main
            }}
        >
            <Typography
                width="16.6666%"
                p="0 3rem"
                fontSize="2rem"
            >
                Type:
            </Typography>

            <Typography
                width="16.6666%"
                p="0 3rem"
                fontSize="2rem"
            >
                Subtype:
            </Typography>

            <Typography
                width="40%"
                p="0 3rem"
                fontSize="2rem"
            >
                Description:
            </Typography>

            <Typography
                width="16.6666%"
                p="0 3rem"
                fontSize="2rem"
            >
                Date:
            </Typography>

            <Typography
                width="10%"
                p="0 3rem"
                fontSize="2rem"
            >
                Price:
            </Typography>
        </FlexBetween>

        {isDataFetched && records.map((record) => (
            <Record
                key={record._id}
                record={record}
                token={token}
            />
        ))}
    </Box>
    );
};

export default RecordHistory;