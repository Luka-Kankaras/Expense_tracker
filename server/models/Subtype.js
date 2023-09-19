import mongoose from "mongoose"

const SubtypeSchema = new mongoose.Schema(
    {
        typeId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            min: 2,
            required: true,
        }
    },
    { timestamps: true }
);

const Subtype = mongoose.model("Subtype", SubtypeSchema);
export default Subtype;