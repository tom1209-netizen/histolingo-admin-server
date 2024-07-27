import Joi from 'joi';

const emailSchema = Joi.object({
    email: Joi.string().email().required()
});

export const validateEmail = (req, res, next) => {
    const { error } = emailSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};