// models/question.js
export default (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      public_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true
      },
      exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      thumbnail: {
        type: DataTypes.TEXT // link ảnh minh họa (nếu có)
      },
      record: {
        type: DataTypes.TEXT // link file audio (nếu có)
      },
      type: {
        type: DataTypes.ENUM('single_choice', 'multiple_choice', 'listening', 'reading'),
        allowNull: false
      }
    }, {
      tableName: 'questions',
      timestamps: false
    });
  
    Question.associate = (models) => {
      Question.belongsTo(models.Exam, { foreignKey: 'exam_id', onDelete: 'CASCADE' });
      Question.hasMany(models.Answer, { foreignKey: 'question_id', onDelete: 'CASCADE' }); 
    };
  
    return Question;
  };
  