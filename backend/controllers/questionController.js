import Question from '../models/Question.js';

/**
 * Create a new question
 */
export const createQuestion = async (req, res, next) => {
  try {
    const { questionText, company, topic, role, difficulty } = req.body;

    const question = await Question.create({
      questionText,
      company,
      topic,
      role,
      difficulty,
      submittedBy: req.user ? req.user.id : null
    });

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: question
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all questions with filtering, sorting, pagination
 */
export const getAllQuestions = async (req, res, next) => {
  try {
    const { company, topic, role, difficulty, sort, fromDate, toDate, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (company) filter.company = company;
    if (topic) filter.topic = topic;
    if (role) filter.role = role;
    if (difficulty) filter.difficulty = difficulty;

    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    let sortOption = {};
    if (sort === 'latest') sortOption = { createdAt: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };
    else if (sort === 'upvotes') sortOption = { upvotes: -1 };
    else sortOption = { createdAt: -1 };

    const skip = (page - 1) * limit;

    const questions = await Question.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('submittedBy', 'name email');

    const total = await Question.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: questions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get question by ID
 */
export const getQuestionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id).populate('submittedBy', 'name email');

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    res.status(200).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

/**
 * Update question
 */
export const updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { questionText, topic, difficulty } = req.body;

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    if (req.user.role !== 'admin' && question.submittedBy?.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (questionText) question.questionText = questionText;
    if (topic) question.topic = topic;
    if (difficulty) question.difficulty = difficulty;

    const updatedQuestion = await question.save();
    res.status(200).json({ success: true, data: updatedQuestion });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete question
 */
export const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    if (req.user.role !== 'admin' && question.submittedBy?.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await question.deleteOne();
    res.status(200).json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Upvote question
 */
export const upvoteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    await question.addUpvote(userId);

    res.status(200).json({
      success: true,
      message: 'Upvote toggled',
      upvotes: question.upvotes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get total upvotes
 */
export const getQuestionUpvotes = async (req, res, next) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    res.status(200).json({ success: true, upvotes: question.upvotes });
  } catch (error) {
    next(error);
  }
};

/**
 * Search questions
 */
export const searchQuestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Search query is required' });

    const regex = new RegExp(q, 'i');

    const questions = await Question.find({
      $or: [
        { questionText: regex },
        { company: regex },
        { topic: regex }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    next(error);
  }
};

/**
 * Get categories (distinct topics, companies, roles)
 */
export const getCategories = async (req, res, next) => {
  try {
    const topics = await Question.distinct('topic');
    const companies = await Question.distinct('company');
    const roles = await Question.distinct('role');

    res.status(200).json({ success: true, topics, companies, roles });
  } catch (error) {
    next(error);
  }
};
