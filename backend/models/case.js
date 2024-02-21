const mongoose = require('mongoose')

const caseSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "untitled"
    },
    image: {
        type: String,
        required: true,
    },
    primaryIllness: {
        type: String,
        required: true,
    },
    supporting: [{
        type: String,
        defualt: [],
    }],
    unsupporting: [{
        type: String,
        default: [],
    }],
    multipleChoices: [{
        type: String,
        default: [],
    }],
    description: {
        type: String,
        default: ""
    },
    initialSymptoms: {
        type: String,
        default: ""
    },
    // answer: {
    //     type: String,
    //     default:""
    // },
    responses: {
        correct: {
            type: Number,
            default: 0,
        },
        incorrect: {
            type: Number,
            default: 0,
        },
        count: {
            0: {
                type: Number,
                default: 0
            },
            1: {
                type: Number,
                default: 0
            },
            2: {
                type: Number,
                default: 0
            },
            3: {
                type: Number,
                default: 0
            },
            4: {
                type: Number,
                default: 0
            },
        },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
// Rob adding here 12.3.23:
        pertinentPositives: [ {
            pertinentPositiveObject: {
                pertinentPositive: {
                    type: String,
                    default: ""
                },
                unlockKeywords: {
                    type: String, // user will separate keywords by commas if multiple
                    default: ""
                },
                unlockContext: {
                    type: String,
                    default: ""
                },
        }
        }],
        pertinentNegatives: [ {
            pertinentNegativeObject: {
                pertinentNegative: {
                    type: String,
                    default: ""
                },
                unlockKeywords: {
                    type: String, // user will separate keywords by commas if multiple
                    default: ""
                },
                unlockContext: {
                    type: String,
                    default: ""
                },
        }
        }],
}, {
    timestamps: true
})

module.exports = mongoose.model('Case', caseSchema)