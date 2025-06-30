import mongoose, {Schema} from "mongoose";

const addressSchema = new Schema({
    fullname:{type: String, required: true},
    mobile: {type: Number, required: true},
    pincode: {type: Number, required: true},
    state: {type: String, required: true},
    city: {type: String, required: true},
    locality: {type: String, required: true},
    area: {type: String, required: true},
    addressType: {type: String, required: true},
    landmark: {type: String},
    alternate: {type: String}
});


export default addressSchema;