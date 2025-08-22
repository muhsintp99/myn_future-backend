const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    shortDesc: {
        type: String,
        required: true
    },
    fullDesc: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
        default: '/public/default/picture.png'
    },
    link: {
        type: String,
        unique: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdBy: { type: String, default: 'admin' },
    updatedBy: { type: String, default: 'admin' }
}, { timestamps: true });

blogSchema.index({createdAt: 1});

module.exports = mongoose.model('Blog', blogSchema);