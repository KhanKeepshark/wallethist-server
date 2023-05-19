import { body } from "express-validator";

export const registerValidation = [
    body('password', 'Пароль должен содержать более 5 символов').isLength({ min: 5 }),
    body('name', 'Имя не должно быть пустым').isLength({ min: 3 })
]