// const mongoose = require('mongoose');

// const gallerySchema = new mongoose.Schema({
//     image: {
//         type: String,
//         required: true,
//         default: '/public/defult/noimage.png'
//     },
//     date: {
//         type: Date,
//         required: true,
//         // default: Date.now,
//         default: false 
//     },
//     title: {
//         type: String,
//         required: true
//     },
//     from: {
//         type: String,
//         required: true
//     },
//     link: {
//         type: String,
//         required: true,
//         unique: true,
//         sparse: true, // allow multiple docs without link
//         // validate: {
//         //     validator: function (v) {
//         //         if (!v) return true; // allow empty
//         //         return /^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w\-\.]*)*\/?$/.test(v);
//         //     },
//         //     message: props => `${props.value} is not a valid URL!`
//         // }
//     },
//     isDeleted: {
//         type: Boolean,
//         default: false
//     },
//     createdBy: {
//         type: String,
//         default: 'admin'
//     },
//     updatedBy: {
//         type: String,
//         default: 'admin'
//     }
// }, {
//     timestamps: true
// });

// const Gallery = mongoose.model('Gallery', gallerySchema);

// module.exports = Gallery;


const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
        default: '/public/defult/noimage.png'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: String,
        default: 'admin'
    },
    updatedBy: {
        type: String,
        default: 'admin'
    }
}, {
    timestamps: true
});

// Index for better query performance
gallerySchema.index({ createdAt: -1 });
gallerySchema.index({ isDeleted: 1 });
gallerySchema.index({ date: -1 });

const Gallery = mongoose.model('Gallery', gallerySchema);
module.exports = Gallery;