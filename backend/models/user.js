const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User } = require('.');

const SALT_ROUNDS = 6;

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true
    },
    password: {
      type: String,
      trim: true,
      minLength: 3,
      required: true
    },
    admin: {
      type: Boolean,
      default: false
    },
    totalScore: {
      type: Number,
      default: 0
    },
    completedCases: {
      correct: {
        type: Number,
        default: 0,
      },
      // currently, the below incorrect metric is never being tallied, as all responses are rendered to be correct in the end
      incorrect: {
        type: Number,
        default: 0,
      },
      casesList: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Case",
      }],
      responses: [{
        caseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Case",
        },
        allResponses: [{
          type: String,
        }],
        response: {
          type: String,
          default: ""
        },
        correct: {
          type: Boolean
        },
        score: {
          type: Number,
          default: 0
        },
        logOpenAI: [{
          question: {
            type: String,
            default: ""
          },
          response: {
            type: String,
            default: ""
          }
        }]
      }],

      // William commenting out below 01/08/2024
      // responsesMap: {
      //   caseId: {
      //     type: Map,
      //     of: String
      //   }
      // }


      // incorrect: [{
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: "Case"      
      // }]

      // {
      //   mongoose.Schema.Types.ObjectId: response
      // }
      // user.completedCases[caseId] ? {} : {}
    }
}, {
    timestamps: true,
    toJSON: {
      transform: function(doc, ret){
        delete ret.password;
        return ret;
      }
    }
})

userSchema.pre('save', async function (next) {

  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);

});



module.exports = mongoose.model('User', userSchema)