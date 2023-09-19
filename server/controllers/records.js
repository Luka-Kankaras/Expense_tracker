import Record from "../models/Record.js";
import Type from "../models/Type.js"
import Subtype from "../models/Subtype.js";
import {request, response} from "express";

/* CREATE */

export const createRecord = async (request, response) => {
    try {
        const { userId, price, description, typeId, subtypeId, income } = request.body;
        const newRecord = new Record({
            userId,
            price,
            description,
            typeId,
            subtypeId,
            income
        });

        await newRecord.save();

        const updatedRecords = await Record.find();

        response.status(201).json(updatedRecords);
    }
    catch (err) {
        response.status(409).json({ error: err.message });
    }
};

export const createType = async (request, response) => {
    try {
        const { userId, name } = request.body;

        const newType = new Type({
           userId,
           name
        });

        const savedType = await newType.save();

        response.status(201).json(savedType);
    }
    catch(err) {
        response.status(409).json({ error: err.message });
    }
};

export const createSubtype = async (request, response) => {
    try {
        const { typeId, name } = request.body;

        const newSubtype = new Subtype({
            typeId,
            name
        });

        const savedSubtype = await newSubtype.save();

        response.status(201).json(savedSubtype);
    }
    catch(err) {
        response.status(409).json({ error: err.message });
    }
};

/* DELETE */

export const removeType = async (request, response) => {
    try {
        const { typeId } = request.body;
        const deleteType = await Type.findByIdAndDelete(typeId);
        if(deleteType) {
            response.status(200).send("Record type deleted.")
        }
        else {
            response.status(404).send("Record type not found.")
        }
    }
    catch (err) {
        response.status(404).json({ error: err.message });
    }
}

export const removeSubtype = async (request, response) => {
    try {
        const { subtypeId } = request.body;
        const deleteSubtype = await Subtype.findByIdAndDelete(subtypeId);
        if(deleteSubtype) {
            response.status(200).send("Record subtype deleted.")
        }
        else {
            response.status(404).send("Record subtype not found.")
        }
    }
    catch (err) {
        response.status(404).json({ error: err.message });
    }
}

/* GET */

export const getUserRecords = async (request, response) => {
    try {
        const { userId } = request.params;
        const records = await Record.find({ userId }).sort({ createdAt: -1 });
        response.status(200).json(records);
    }
    catch (err) {
        response.status(404).json({ error: err.message });
    }
};

export const getUserRecordTypes = async (request, response) => {
    try {
        const { userId } = request.params;
        const types = await Type.find({ userId });
        response.status(200).json(types);
    } catch (err) {
        response.status(404).json({ error: err.message });
    }
};

export const subtypesOfType = async (request, response) => {
    try {
        const { typeId } = request.params;
        const subtypes = await Subtype.find({ typeId });
        response.status(200).json(subtypes);
    }
    catch (err) {
        response.status(404).json({ error: err.message });
    }
}
