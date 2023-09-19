import { Box, Button, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {setLogin, setLogout, setPage} from "../../state";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const Navbar = () => {
    const page = useSelector((state) => state.page);
    const palette = useTheme().palette;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectPage = (page) => {
        dispatch(setPage({ page: page }));
    };

    return (
        <Box
            width="100%"
            height="auto"
            display="flex"
            justifyContent="space-between"
            // height="auto"
            alignItems="horizontal"
            // backgroundColor={palette.primary.dark}
        >
            <Box style={{ flex: "0 0 auto" }}>
                <Button
                    width="33%"
                    sx={{
                        p: "1rem",
                        backgroundColor: palette.primary.dark,
                        borderRadius: "0px",
                        color: palette.background.alt,
                        fontSize: "1rem",
                        "&:hover": { backgroundColor: palette.primary.main, color: "black" },
                    }}
                    onClick={() => selectPage({ page: "Record History" })}
                >
                    Record History
                </Button>
                <Button
                    width="33%"
                    sx={{
                        p: "1rem",
                        backgroundColor: palette.primary.dark,
                        borderRadius: "0px",
                        color: palette.background.alt,
                        fontSize: "1rem",
                        "&:hover": { backgroundColor: palette.primary.main, color: "black" },
                    }}
                    onClick={() => selectPage({ page: "New Record" })}
                >
                    New Record
                </Button>
                <Button
                    width="33%"
                    sx={{
                        p: "1rem",
                        backgroundColor: palette.primary.dark,
                        borderRadius: "0px",
                        color: palette.background.alt,
                        fontSize: "1rem",
                        "&:hover": { backgroundColor: palette.primary.main, color: "black" },
                    }}
                    onClick={() => selectPage({ page: "Record Types" })}
                >
                    Record Types
                </Button>
            </Box>
            <Box style={{
                display: "flex",
                flex: "4 1 auto",
                justifyContent: "center",
                backgroundColor: palette.primary.dark,
                alignItems: "center",
            }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: "2rem",
                        fontWeight: "bold",
                        color: "white",
                    }}
                >
                    {page.page}
                </Typography>
            </Box>
            <Box style={{
                display: "flex",
                flex: "1 1 auto",
                justifyContent: "right",
                backgroundColor: palette.primary.dark,
            }}>
                <Button
                    sx={{
                        p: "1rem",
                        backgroundColor: palette.primary.dark,
                        borderRadius: "0px",
                        color: palette.background.alt,
                        fontSize: "1rem",
                        "&:hover": { backgroundColor: palette.primary.main, color: "black" },
                    }}
                    onClick={() => {
                        dispatch(setLogout());
                        navigate("/");
                    }}
                >
                    LOG OUT
                </Button>
            </Box>
        </Box>
    );
};

export default Navbar;