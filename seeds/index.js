const sequelize = require('../config/connection');
const { Explorer, Post, Comment } = require('../models');

const explorerData = require('./ExplorerData.json');
const postData = require('./postData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await Explorer.bulkCreate(explorerData, {
    individualHooks: true,
    returning: true
  });

  await Post.bulkCreate(postData, {returning: true});

  await Comment.bulkCreate(commentData, {returning:true});

  process.exit(0);
};

seedDatabase();