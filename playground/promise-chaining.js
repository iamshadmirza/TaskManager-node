require('../src/db/mongoose');
var User = require('../src/models/users');

User.findByIdAndUpdate('5ca566030b56d91f7cc3094c', { age: 1 }).then((user) => {
    console.log(user);
    return User.countDocuments({ age: 1 });
}).then((result) => {
    console.log(result);
}).catch(error => console.log(error));

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age });
    const count = await User.countDocuments({ age });
    return count;
}

updateAgeAndCount('5ca566030b56d91f7cc3094c', 2).then(count => {
    console.log(count);
}).catch(error => console.log(error));