export default (sequelize, DataTypes) => {
    const UserProgress = sequelize.define('UserProgress', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.INTEGER },
      lesson_id: { type: DataTypes.INTEGER },
      completed_at: DataTypes.DATE,
      score: DataTypes.INTEGER,
    }, {
      tableName: 'user_progresses',
      timestamps: false
    });
  
    UserProgress.associate = models => {
      UserProgress.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      UserProgress.belongsTo(models.Lesson, { foreignKey: 'lesson_id', onDelete: 'CASCADE' });
    };
  
    return UserProgress;
  };
  