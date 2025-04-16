// models/testattempt.js
export default (sequelize, DataTypes) => {
    const TestAttempt = sequelize.define('TestAttempt', {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      test_id: {
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
      tableName: 'test_attempts',
      timestamps: false
    });
  
    TestAttempt.associate = (models) => {
      TestAttempt.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      });
      TestAttempt.belongsTo(models.Test, {
        foreignKey: 'test_id',
        onDelete: 'CASCADE'
      });
    };
  
    return TestAttempt;
  };
  