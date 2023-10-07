// Import the Sequelize models
const Post = require('./Post');
const Explorer = require('./Explorer');
const Comment = require('./Comment');

// Defining the one-to-many relation between the tables corresponding to Explorer (source) and Post (target)
Explorer.hasMany(Post, {
  foreignKey: 'explorer_id',
  onDelete: 'CASCADE'
});

Post.belongsTo(Explorer, {
  foreignKey: 'explorer_id',
});

Explorer.hasMany(Comment, {
    foreignKey: 'explorer_id',
    unique: false,
    onDelete: 'CASCADE'
});

  
Comment.belongsTo(Explorer, {
    foreignKey: 'explorer_id',
    unique: false
});

//Defining the many-to-many relation between the tables corresponding to Post and Comment

Post.hasMany(Comment, {
    foreignKey: 'post_id',
    unique: false,
    onDelete: 'CASCADE'
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id',
    unique: false
});

module.exports = {
  Post,
  Explorer,
  Comment
};
