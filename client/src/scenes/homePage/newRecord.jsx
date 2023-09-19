import {useEffect, useState} from "react";
import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    useTheme, Autocomplete,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import {setRecords, setTypes} from "../../state";

const schema = yup.object().shape({
    price: yup.number().required("required"),
    description: yup.string().required("required"),
    income: yup.boolean().required("required"),
    type: yup.mixed().test('isTypeValid', 'required', (value) => {
        if (typeof value === 'string') {
            return value !== ''; // Allow non-empty string
        }
        return value && value.name !== ''; // Allow selected option
    }),
    subtype: yup.mixed().test('isSubtypeValid', 'required', (value) => {
        if (typeof value === 'string') {
            return value !== ''; // Allow non-empty string
        }
        return value && value.name !== ''; // Allow selected option
    }),
});

const initialValues = {
    price: 0,
    description: "",
    income: "false",
    type: "",
    subtype: "",
};

const NewRecord = () => {
    const { palette } = useTheme();
    const dispatch = useDispatch();

    const types = useSelector((state) => state.types);
    const token = useSelector((state) => state.token);
    const user = useSelector((state) => state.user);

    const [selectedType, setSelectedType] = useState({ name: "", _id: "" });
    const [subtypes, setSubtypes] = useState([]);

    useEffect(() => {
        const getSubtype = async () => {
            if(selectedType._id === "") {
                setSubtypes([]);
                return;
            }

            const fetchResponse = await fetch(`http://localhost:3002/records/subtypes/${selectedType._id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const resultSubtypes = await fetchResponse.json();
            setSubtypes(resultSubtypes);
        };

        const fetchData = async () => {
            await getSubtype();
        };

        fetchData();
    }, [selectedType, token]);

    const handleFormSubmit = async (values, onSubmitProps) => {
        const type = types.find(curr => curr.name === values.type.name);
        if(type) {
            values.type = { name: type.name, _id: type._id };
        }
        else {
            const createTypeResponse = await fetch(`http://localhost:3002/records/types/create`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user._id,
                    name: values.type.name
                })
            });

            const createdType = await createTypeResponse.json();
            dispatch(setTypes({ types: [...types, createdType] }));

            values.type = { name: createdType.name, _id: createdType._id };
        }

        const subtype = subtypes.find(curr => curr.name === values.subtype.name && curr.typeId === values.type._id);
        if(subtype) {
            values.subtype = { name: subtype.name, _id: subtype._id };
        }
        else {
            const createSubtypeResponse = await fetch(`http://localhost:3002/records/subtypes/create`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    typeId: values.type._id,
                    name: values.subtype.name
                })
            });

            const createdSubtype = await createSubtypeResponse.json();
            values.subtype = { name: createdSubtype.name, _id: createdSubtype._id };
        }

        const createRecordResponse = await fetch(`http://localhost:3002/records/create`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: user._id,
                price: values.price,
                description: values.description,
                typeId: values.type._id,
                subtypeId: values.subtype._id,
                income: values.income
            })
        });

        const updatedRecords = await createRecordResponse.json();
        dispatch(setRecords({ records: updatedRecords }));

        setSelectedType({ name: "", _id: "" });
        setSubtypes([]);
        onSubmitProps.resetForm();
    };

    return (
        <Box
            width="100%"
            m="10% 20%"
            p="2% 2%"
            borderRadius="1.5rem"
            border="2px solid"
            borderColor={palette.primary.dark}
            sx={{
                backgroundColor: palette.background.alt,
            }}
        >
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={schema}
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
                    <form onSubmit={handleSubmit}>

                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        >
                            <TextField
                                label="Description"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.description}
                                name="description"
                                error={Boolean(touched.description) && Boolean(errors.description)}
                                helperText={touched.description && errors.description}
                                sx={{ gridColumn: "span 4" }}
                            />

                            <TextField
                                label="Price"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.price}
                                name="price"
                                error={Boolean(touched.price) && Boolean(errors.price)}
                                helperText={touched.price && errors.price}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <Select
                                value={values.income}
                                label="Income"
                                onChange={handleChange}
                                name="income"
                                sx={{ gridColumn: "span 2" }}
                            >
                                <MenuItem value={false}>Expense</MenuItem>
                                <MenuItem value={true}>Income</MenuItem>
                            </Select>

                            <Autocomplete
                                value={values.type}
                                name="type"
                                options={types || []}
                                onInputChange={(event, newInputValue) => {
                                    setFieldValue("type", { name: newInputValue, _id: "" });
                                    const type = types.find(curr => curr.name === newInputValue);
                                    setSelectedType({ name: newInputValue, _id: type ? type._id : '' });
                                }}
                                getOptionLabel={(option) => option.name || ""}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Record Type"
                                        error={Boolean(touched.type) && Boolean(errors.type)}
                                        helperText={touched.type && errors.type}
                                    />
                                )}
                                freeSolo // Allow typing new values
                                style={{
                                    gridColumn: "span 4"
                                }}
                            />

                            <Autocomplete
                                value={values.subtype}
                                name="subtype"
                                onInputChange={(event, newValue) => {
                                    setFieldValue("subtype", { name: newValue, _id: "" });
                                }}
                                options={subtypes || []}
                                getOptionLabel={(option) => option.name || ""}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Record Subtype"
                                        error={Boolean(touched.subtype) && Boolean(errors.subtype)}
                                        helperText={touched.subtype && errors.subtype}
                                    />
                                )}
                                freeSolo // Allow typing new values
                                style={{
                                    gridColumn: "span 4"
                                }}
                            />

                        </Box>

                        {/* BUTTONS */}
                        <Box>
                            <Button
                                fullWidth
                                type="submit"
                                sx={{
                                    m: "2rem 20%",
                                    p: "0.5rem",
                                    width: "60%",
                                    backgroundColor: palette.primary.main,
                                    color: palette.background.alt,
                                    fontSize: "1rem",
                                    "&:hover": { color: palette.primary.main },
                                }}
                            >
                                ADD RECORD
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

export default NewRecord;

