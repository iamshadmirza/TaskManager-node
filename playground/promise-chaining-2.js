require('../src/db/mongoose');
var Tasks = require('../src/models/tasks');

Tasks.findByIdAndDelete('5ca567a56ebe290c60857cbf').then((task) => {
    console.log(task);
    return Tasks.countDocuments({ completed: false });
}).then((result) => {
    console.log(result);
}).catch(error => console.log(error));