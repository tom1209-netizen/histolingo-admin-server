import { Schema, model } from "mongoose";
import { roleStatus, allPrivileges } from "../constants/role.constant.js";

const roleSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            maxLength: 250
        },
        status: {
            type: Number,
            enum: [roleStatus.inactive, roleStatus.active],
            default: roleStatus.active,
            required: true
        },
        permissions: {
            type: [Number],
            validate: {
                validator: function (v) {
                    return v.every(p => allPrivileges.includes(p));
                },
                message: props => `${props.value} is not a valid privilege!`
            },
            required: true
        }
    },
    { timestamps: true }
);

const Role = model("Role", roleSchema);

export default Role;
