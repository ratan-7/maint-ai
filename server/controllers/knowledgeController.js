const { searchKnowledge } = require("../services/knowledgeService");

const searchKnowledgeBase = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const results = searchKnowledge(q);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Knowledge search failed",
      error: error.message,
    });
  }
};

module.exports = {
  searchKnowledgeBase,
};
