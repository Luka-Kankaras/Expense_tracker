import mongoose from "mongoose"

const TypeSchema = new mongoose.Schema(
    {
        userId: {
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

const Type = mongoose.model("Type", TypeSchema);
export default Type;