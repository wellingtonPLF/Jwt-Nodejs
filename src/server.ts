import express from 'express'
import cors from 'cors';
import userRoute from './Controllers/UserController';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser"
import dotenvExpand from 'dotenv-expand';
import authRoute from './Controllers/AuthController';
import { JwtAuthenticationFilter } from './Filter/JwtAuthenticationFilter';

const app = express();
const filter = new JwtAuthenticationFilter();

app.use(cors())
app.use(cookieParser())
app.use(express.json());
app.use(filter.middlewareFilter.bind(filter))
app.use([
    userRoute,
    authRoute
])

var myEnv = dotenv.config();
dotenvExpand.expand(myEnv)

app.listen(process.env.PORT || 3000, () => {
    console.log('HTTP SERVER RUNNING!')
})