const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scrapModel = new Schema({
    url: {
        type: String,
        allowNull: false,
        trim: true,
    },
    name: {
        type: String,
        allowNull: false,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    logo: {
        type: String,
        trim: true,
    },
    facebook: {
        type: String,
        trim: true,
    },
    linkedin: {
        type: String,
        trim: true,
    },
    twitter: {
        type: String,
        trim: true,
    },
    instagram: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        allowNull: false,
        trim: true,
    },
    screenshot: {
        type: String,
        trim: true,
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 1, // 1 for active, 0 for deleted
    },
}, {
    timestamps: true 
});

module.exports = mongoose.model('scraping', scrapModel);
