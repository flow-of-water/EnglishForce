// models/testattempt.js
export default (sequelize, DataTypes) => {
    const ExamAttempt = sequelize.define('ExamAttempt', {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      exam_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      start: {
        type: DataTypes.DATE,
        allowNull: false
      },
      end: {
        type: DataTypes.DATE,
        allowNull: false
      },
      score: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
      }
    }, {
      tableName: 'exam_attempts',
      timestamps: false
    });
  
    ExamAttempt.associate = (models) => {
      ExamAttempt.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      });
      ExamAttempt.belongsTo(models.Exam, {
        foreignKey: 'exam_id',
        onDelete: 'CASCADE'
      });
    };
  
    return ExamAttempt;
  };
  