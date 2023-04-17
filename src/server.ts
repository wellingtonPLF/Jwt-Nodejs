import express from 'express'
import cors from 'cors';
import userRoute from './Controllers/UserController';

const app = express();

app.use(cors()) 
app.use(express.json());
app.use([
    userRoute,
])

app.listen(process.env.PORT || 3000, () => {
    console.log('HTTP SERVER RUNNING!')
})