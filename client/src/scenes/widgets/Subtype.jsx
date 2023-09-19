import { Typography, useTheme } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";

const Subtype = ({ subtype }) => {

    const palette = useTheme().palette;

    const [reps, setReps] = useState(0);

    const records = useSelector((state) => state.records);

    useEffect(() => {
        let numOfReps = 0;
        records.map((record) => {
            if(record.subtypeId === subtype._id) {
                numOfReps++;
            }
        });

        setReps(numOfReps);

    }, [reps]);

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
                <Typography
                    width="60%"
                    p="0 3rem"
                    fontSize="1.5rem"
                >
                    {subtype.name}
                </Typography>

                <Typography
                    width="40%"
                    p="0 3rem"
                    fontSize="1.5rem"
                    textAlign="right"
                >
                    {reps}
                </Typography>

            </FlexBetween>
        </>
    );
};

export default Subtype;