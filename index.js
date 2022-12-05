import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import { registerValidation, loginValidation, postCreateValidation } from './validation.js';
import checkAuth from './utils/checkAuth.js';
import handleValidationError from './utils/handleValidationError.js';
import PostModel from './models/Post.js';

import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('DB ok');
  })
  .catch((err) => console.log(err)); // подключили наш кластер(БД)

const app = express(); // создаем сервер
app.use(cors());

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json()); //позволяет читать нам (нашему коду) json файлы который пришли в наших запросах
app.use('/uploads', express.static('uploads')); //для открытия файлов в браузере по ссылке

app.post('/auth/register', registerValidation, UserController.register);
app.post('/auth/login', loginValidation, UserController.login);
app.get('/auth/me', checkAuth, UserController.getUser);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/tags', async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    return res.json([...new Set(tags)]);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить теги',
    });
  }
});
app.post('/posts', checkAuth, postCreateValidation, handleValidationError, PostController.create);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationError,
  PostController.update,
);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);

// app.get('/', (req, res) => {
//   res.send('Hello world!');
// }); // req - получили от пользователя, res - вернули пользователю ответ
app.listen(process.env.PORT || 3333, (err) => {
  if (err) console.log(err);
  console.log('server ok');
}); //запускаем сервер на нужном порте
