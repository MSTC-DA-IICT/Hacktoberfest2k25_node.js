import mongoose from 'mongoose';

/**
 * QUESTION SCHEMA
 */
const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
      trim: true,
      minlength: 10
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    topic: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard']
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    upvotes: {
      type: Number,
      default: 0,
      min: 0
    },
    upvotedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: []
    }
  },
  {
    timestamps: true
  }
);

/**
 * INDEXES FOR OPTIMIZATION
 */
questionSchema.index({ company: 1 });
questionSchema.index({ topic: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ questionText: 'text' });
questionSchema.index({ company: 1, topic: 1, role: 1 });

/**
 * INSTANCE METHOD: addUpvote
 */
questionSchema.methods.addUpvote = async function(userId) {
  if (this.upvotedBy.includes(userId)) {
    // Remove upvote
    this.upvotedBy.pull(userId);
    this.upvotes = this.upvotes - 1;
  } else {
    // Add upvote
    this.upvotedBy.push(userId);
    this.upvotes = this.upvotes + 1;
  }
  return await this.save();
};

/**
 * CREATE AND EXPORT QUESTION MODEL
 */
const Question = mongoose.model('Question', questionSchema);
export default Question;