import { Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import FlexBetween from "../../components/FlexBetween";
import {useEffect, useState} from "react";


const Record = ({ record }) => {
    const palette = useTheme().palette;

    const token = useSelector((state) => state.token);
    const types = useSelector((state) => state.types);
    const type = types.find(type => type._id === record.typeId);
    const date = new Date(record.createdAt);
    const timestamp =  date.getDate() + "-" +
        (date.getMonth() + 1) + "-" +
        date.getFullYear() + " " +
        date.getHours() + ":" +
        String(date.getMinutes()).padStart(2, "0");

    const [subtype, setSubtype] = useState(null);

    const getSubtype = async () => {
        const fetchResponse = await fetch(`http://localhost:3002/records/subtypes/${type._id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const resultSubtype = await fetchResponse.json();
        setSubtype(resultSubtype.find(subtype => subtype._id === record.subtypeId));
    };

    useEffect(() => {
        const fetchData = async () => {
            await getSubtype();
        };

        fetchData();
    }, []);

    return (
        <>
            <FlexBetween
                width="100%"
                height="4rem"
                sx={{
                    justifyContent: "space-evenly",
                    "&:hover": { backgroundColor: palette.primary.light },
                }}
            >
                {subtype !== null ? (
                    <>
                        <Typography
                            width="16.6666%"
                            p="0 3rem"
                            fontSize="1.5rem"
                        >
                            {type.name}
                        </Typography>

                        <Typography
                            width="16.6666%"
                            p="0 3rem"
                            fontSize="1.5rem"
                        >
                            {subtype.name}
                        </Typography>

                        <Typography
                            width="40%"
                            p="0 3rem"
                            fontSize="1.5rem"
                        >
                            {record.description}
                        </Typography>

                        <Typography
                            width="16.6666%"
                            p="0 3rem"
                            fontSize="1.5rem"
                        >
                            {timestamp}
                        </Typography>

                        <Typography
                            width="10%"
                            p="0 3rem"
                            fontSize="1.5rem"
                        >
                            {record.income ? "+" : "-"}{record.price} €
                        </Typography>
                    </>
                ) : (
                    <>
                        <Typography
                            p="0 3rem"
                            fontSize="1.5rem"
                        >
                            Loading...
                        </Typography>
                    </>
                )}
            </FlexBetween>
        </>
    );
};

/**/

export default Record;