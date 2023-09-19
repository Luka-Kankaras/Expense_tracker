import mongoose from "mongoose"

const RecordSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        description: {
            type: String,
        },
        typeId: {
            type: String,
            required: true,
        },
        subtypeId: {
            type: String,
            required: true,
        },
        income: {
            type: Boolean,
            required: true,
        },
    },
    { timestamps: true }
);

const Record = mongoose.model("Record", RecordSchema);
export default Record;