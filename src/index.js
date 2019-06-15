const express = require('express');
const app = express();
require('./db/mongoose');

const userRouter = require('./routers/users');
const taskRouter = require('./routers/tasks');

const port = process.env.PORT;

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down check back soon');
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server is up on port ', port);
});