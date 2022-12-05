import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Неверный email').isEmail(),
  body('password', 'Неверная длинна пароля').isLength({ min: 5 }),
];

export const registerValidation = [
  body('email', 'Неверный email').isEmail(),
  body('password', 'Неверная длинна пароля').isLength({ min: 5 }),
  body('fullName', 'Неверное имя').isLength({ min: 3 }),
  body('avatarUrl', 'Неверный Url картинки').optional().isURL(),
];

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
  body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
  body('tags', 'Неверный формат тэгов ').optional().isArray(),
  body('imageUrl', 'Неверная ссылка на изоображение').optional().isString(),
];
