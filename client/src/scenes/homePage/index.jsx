import { useEffect } from "react";
import { Box } from "@mui/material"
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar/index";
import RecordHistory from "./recordHistory";
import NewRecord from "./newRecord";
import RecordTypes from "./recordTypes";

const HomePage = () => {
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const page = useSelector((state) => state.page);

    useEffect(() => {
    }, [page]);

    return (
    <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
        <Navbar/>
        <Box
            display="flex"
            flex="1"
            width="100%"
        >
            {page.page === "Record History" && <RecordHistory userId={user._id} token={token} />}
            {page.page === "New Record" && <NewRecord />}
            {page.page === "Record Types" && <RecordTypes />}
        </Box>
    </div>
    );
};

export default HomePage;