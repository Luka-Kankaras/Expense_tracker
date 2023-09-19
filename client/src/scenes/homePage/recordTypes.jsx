import {Autocomplete, Box, Button, MenuItem, Select, TextField, Typography, useTheme} from "@mui/material";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Type from "scenes/widgets/Type";
import Subtype from "scenes/widgets/Subtype";
import FlexBetween from "../../components/FlexBetween";
import {Formik} from "formik";
import * as yup from "yup";
import {setTypes} from "../../state";

const RecordTypes = () => {

    const palette = useTheme().palette;
    const dispatch = useDispatch();

    const [page, setPage] = useState("types");
    const [selectedType, setSelectedType] = useState(null);
    const [selectedSubtypes, setSelectedSubtypes] = useState([]);

    const types = useSelector((state) => state.types);
    const token = useSelector((state) => state.token);
    const user = useSelector((state) => state.user);

    const newTypeSchema = yup.object().shape({
        name: yup.string().required("required")
    });

    const newTypeInitValues = {
        name: ""
    };

    const newSubtypeSchema = yup.object().shape({
        type: yup.string().required("required"),
        name: yup.string().required("required")
    });

    const newSubtypeInitValues = {
        type: "",
        name: ""
    };

    const handleNewTypeSubmit = async (values, onSubmitProps) => {
        const type = types.find(curr => curr.name === values.name);
        if(!type) {

            const createTypeResponse = await fetch(`http://localhost:3002/records/types/create`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user._id,
                    name: values.name
                })
            });

            const createdType = await createTypeResponse.json();
            console.log(createdType);
            dispatch(setTypes({ types: [...types, createdType] }));


        }

        onSubmitProps.resetForm();
        setPage("types");
    }

    const handleNewSubtypeSubmit = async (values, onSubmitProps) => {
        const type = types.find(curr => curr.name === values.type);

        const fetchResponse = await fetch(`http://localhost:3002/records/subtypes/${type._id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const resultSubtypes = await fetchResponse.json();

        const subtype = resultSubtypes.find(curr => curr.name === values.name);
        if(!subtype) {
            const createSubtypeResponse = await fetch(`http://localhost:3002/records/subtypes/create`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    typeId: type._id,
                    name: values.name
                })
            });

            const createdSubtype = await createSubtypeResponse.json();
            onSubmitProps.resetForm();
            setPage("types");
        }
    }

    useEffect(() => {

        console.log(types);

        const fetchData = async () => {
            if(selectedType) {
                const fetchResponse = await fetch(`http://localhost:3002/records/subtypes/${selectedType._id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const resultSubtypes = await fetchResponse.json();
                setSelectedSubtypes(resultSubtypes);
            }
        };

        fetchData();
    }, [selectedType]);

    return (
        <Box
            width="100%"
            p="2% 2%"
        >
            {page === "types" && (
                <Box
                    width="100%"
                    height="100%"
                    display="flex"
                >
                    <Box flex={1} display="flex" flexDirection="column">
                        <Button
                            onClick={() => {
                                setPage("new type");
                            }}
                            sx={{
                                p: "0.5rem",
                                mb: "2%",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                fontSize: "1rem",
                                "&:hover": { color: palette.primary.main },
                            }}
                            fullWidth
                        >
                            ADD NEW TYPE
                        </Button>
                        <Button
                            onClick={() => {
                                setPage("new subtype");
                            }}
                            sx={{
                                p: "0.5rem",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                fontSize: "1rem",
                                "&:hover": { color: palette.primary.main },
                            }}
                            fullWidth
                        >
                            ADD NEW SUBTYPE
                        </Button>
                        <Box
                            flex={1}
                            border="2px solid"
                            borderColor={palette.primary.dark}
                            mt="3%"
                        >
                            <FlexBetween
                                width="100%"
                                height="4rem"
                                sx={{
                                    justifyContent: "space-evenly",
                                    backgroundColor: palette.primary.dark,
                                }}
                            >
                                <Typography
                                    width="40%"
                                    p="0 3rem"
                                    fontSize="1.7rem"
                                >
                                    Subtype name:
                                </Typography>

                                <Typography
                                    width="60%"
                                    p="0 3rem"
                                    fontSize="1.7rem"
                                    textAlign="right"
                                >
                                    Number of records of this subtype:
                                </Typography>
                            </FlexBetween>
                            {selectedSubtypes.map((subtype) => (
                                <Subtype key={subtype._id} subtype={subtype} />
                            ))}
                        </Box>
                    </Box>
                    <Box
                        flex={1}
                        ml="5%"
                        border="2px solid"
                        borderColor={palette.primary.dark}
                    >

                        <FlexBetween
                            width="100%"
                            height="4rem"
                            sx={{
                                justifyContent: "space-evenly",
                                backgroundColor: palette.primary.dark,
                            }}
                        >
                            <Typography
                                width="30%"
                                p="0 3rem"
                                fontSize="1.7rem"
                            >
                                Type name:
                            </Typography>

                            <Typography
                                width="70%"
                                p="0 3rem"
                                fontSize="1.7rem"
                                textAlign="right"
                            >
                                Number of records of this type:
                            </Typography>

                        </FlexBetween>
                        {types.map((type) => (
                            <Box
                                key={type._id}
                                onClick={() => {
                                    setSelectedType(type);
                                }}
                            >
                                <Type
                                    type={type}
                                />
                            </Box>
                        ))}

                    </Box>
                </Box>
            )}
            {page === "new type" && (
                <Box
                    width="40%"
                    height="30%"
                    m="5% auto" // Set auto for left and right margins to center horizontally
                    display="flex"
                    justifyContent="center" // Center content horizontally
                    alignItems="center" // Center content vertically
                    borderRadius="1.5rem"
                    border="2px solid"
                    borderColor={palette.primary.dark}
                    sx={{
                        backgroundColor: palette.background.alt,
                    }}
                >
                    <Formik
                        onSubmit={handleNewTypeSubmit}
                        initialValues={newTypeInitValues}
                        validationSchema={newTypeSchema}
                    >
                        {({
                              values,
                              errors,
                              touched,
                              handleBlur,
                              handleChange,
                              handleSubmit,
                              setFieldValue,
                              resetForm,
                          }) => (
                            <form onSubmit={handleSubmit} style={{ width: "80%" }}>
                                <Box
                                    display="grid"
                                    gap="30px"
                                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                >
                                    <TextField
                                        label="Name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.name}
                                        name="name"
                                        error={Boolean(touched.name) && Boolean(errors.name)}
                                        helperText={touched.name && errors.name}
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                </Box>

                                {/* BUTTONS */}
                                <Box mt={2} textAlign="center"> {/* Add margin-top and center text */}
                                    <Button
                                        fullWidth
                                        type="submit"
                                        sx={{
                                            backgroundColor: palette.primary.main,
                                            color: palette.background.alt,
                                            fontSize: "1rem",
                                            "&:hover": { color: palette.primary.main },
                                        }}
                                    >
                                        ADD TYPE
                                    </Button>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </Box>

            )}

            {page === "new subtype" && (
                <Box
                    width="40%"
                    height="40%"
                    m="5% auto" // Set auto for left and right margins to center horizontally
                    display="flex"
                    justifyContent="center" // Center content horizontally
                    alignItems="center" // Center content vertically
                    borderRadius="1.5rem"
                    border="2px solid"
                    borderColor={palette.primary.dark}
                    sx={{
                        backgroundColor: palette.background.alt,
                    }}
                >
                    <Formik
                        onSubmit={handleNewSubtypeSubmit}
                        initialValues={newSubtypeInitValues}
                        validationSchema={newSubtypeSchema}
                    >
                        {({
                              values,
                              errors,
                              touched,
                              handleBlur,
                              handleChange,
                              handleSubmit,
                              setFieldValue,
                              resetForm,
                          }) => (
                            <form onSubmit={handleSubmit} style={{ width: "80%" }}>
                                <Box
                                    display="grid"
                                    gap="30px"
                                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                >
                                    <label htmlFor="type">Select type:</label>
                                    <Select
                                        value={values.type || ""}
                                        label="Type"
                                        onChange={handleChange}
                                        name="type"
                                        error={touched.type && Boolean(errors.type)}
                                        sx={{ gridColumn: "span 4" }}
                                    >
                                        {types.map((type) => (
                                            <MenuItem key={type._id} value={type.name}>{type.name}</MenuItem>
                                        ))}
                                    </Select>

                                    <TextField
                                        label="Name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.name}
                                        name="name"
                                        error={Boolean(touched.name) && Boolean(errors.name)}
                                        helperText={touched.name && errors.name}
                                        sx={{ gridColumn: "span 4" }}
                                    />

                                </Box>

                                {/* BUTTONS */}
                                <Box mt={2} textAlign="center"> {/* Add margin-top and center text */}
                                    <Button
                                        fullWidth
                                        type="submit"
                                        sx={{
                                            backgroundColor: palette.primary.main,
                                            color: palette.background.alt,
                                            fontSize: "1rem",
                                            "&:hover": { color: palette.primary.main },
                                        }}
                                    >
                                        ADD SUBTYPE
                                    </Button>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </Box>

            )}
        </Box>
    );
};

export default RecordTypes;