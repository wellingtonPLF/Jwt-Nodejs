import express from 'express'
import cors from 'cors';
import userRoute from './Controllers/UserController';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import authRoute from './Controllers/AuthController';

const app = express();

app.use(cors()) 
app.use(express.json());
app.use([
    userRoute,
    authRoute
])

var myEnv = dotenv.config();
dotenvExpand.expand(myEnv)

app.listen(process.env.PORT || 3000, () => {
    console.log('HTTP SERVER RUNNING!')
})