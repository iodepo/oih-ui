import * as yup from "yup";

const schemaValidation = yup
  .object({
    firstName: yup.string().required(),
    age: yup.number().positive().integer().required(),
  })
  .required();

export default schemaValidation;
