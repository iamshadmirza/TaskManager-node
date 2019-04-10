const express = require('express');
const app = express();
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/tasks');

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server is up on port ', port);
});