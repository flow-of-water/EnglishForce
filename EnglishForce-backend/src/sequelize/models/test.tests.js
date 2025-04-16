// models/test.js
export default (sequelize, DataTypes) => {
    const Test = sequelize.define('Test', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      public_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      duration: {
        type: DataTypes.TIME, // hoặc INTEGER nếu bạn muốn lưu phút/giây
        allowNull: false
      }
    }, {
      tableName: 'tests',
      timestamps: false
    });
  
    Test.associate = (models) => {
      Test.hasMany(models.TestAttempt, { foreignKey: 'test_id', onDelete: 'CASCADE' });
    };
  
    return Test;
  };
  