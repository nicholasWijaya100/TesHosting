const Joi = require("joi");

// pengguna_username is required

const userSchema = Joi.object({
  pengguna_username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .label("Nama Pengguna")
    .messages({
      "any.required": "{{#label}} harus diisi yaaa",
      "string.alphanum": "{{#label}} harus alphanumeric",
      "string.min": "{{#label}} harus lebih dari 3 karakter",
      "string.max": "{{#label}} harus kurang dari 30 karakter",
    }),
  pengguna_email: Joi.string()
    .email({ tlds: { allow: ["edu", "com"] } })
    .required()
    .label("Email Pengguna")
    .messages({
      "any.required": "{{#label}} email harus diisi",
      "string.email":
        "{{#label}} harus dalam format email dan tlds nya adalah .com / .edu",
    }),
  pengguna_password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .required()
    .label("Password Pengguna")
    .messages({
      "string.pattern.base":
        "{{#label}} harus diisi dengan minimal 1 huruf kecil, 1 huruf besar, 1 angka dan 1 simbol, dengan panjang minimal 8 karakter",
    }),
  pengguna_konfirmasi_password: Joi.any()
    .equal(Joi.ref("pengguna_password"))
    .label("Konfirmasi Password")
    .messages({ "any.only": "{{#label}} harus sama dengan password" }),
});
