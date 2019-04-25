const express = require('express');
const app = express();
require('./db/mongoose');

const userRouter = require('./routers/users');
const taskRouter = require('./routers/tasks');

const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down check back soon');
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server is up on port ', port);
});

const Task = require('./models/tasks');
const User = require('./models/users');

const main = async () => {
    // const task = await Task.findById('give_one_id_here');
    // await task.populate('owner').execPopulate();
    // console.log(task.owner);

    const user = User.findById('give_one_id_here');
    await user.populate('tasks').execPopulate();
    console.log(user.tasks);
}

main();