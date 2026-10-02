const fs = require("fs");
const path = require("path");

const knowledgeBasePath = path.join(__dirname, "../knowledge-base");

const loadKnowledgeBase = () => {
  const files = fs
    .readdirSync(knowledgeBasePath)
    .filter((file) => file.endsWith(".md"));

  return files.map((file) => ({
    fileName: file,
    content: fs.readFileSync(path.join(knowledgeBasePath, file), "utf-8"),
  }));
};

const searchKnowledge = (query) => {
  const documents = loadKnowledgeBase();

  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2);

  const results = [];

  for (const document of documents) {
    const contentLower = document.content.toLowerCase();

    let score = 0;

    for (const word of queryWords) {
      if (contentLower.includes(word)) {
        score++;
      }
    }

    if (score > 0) {
      results.push({
        fileName: document.fileName,
        score,
        content: document.content,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);

  return results;
};

module.exports = {
  searchKnowledge,
};
