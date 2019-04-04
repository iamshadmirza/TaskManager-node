const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
});

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Haha, nice try kid. Just use a better password and clearly not "password"');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    }
});

const me = new User({
    name: '    Urooj',
    email: 'Urooj@gMail.com',
    password: 'paSSword',
    age: 23
});

me.save().then(() => {
    console.log(me);
}).catch((error) => console.log(error));

const Tasks = mongoose.model('Tasks', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const newTask = new Tasks({
    description: 'Learn Validation and Sanitization',
    completed: true
});

newTask.save().then(() => {
    console.log(newTask);
}).catch((error) => console.log(error));