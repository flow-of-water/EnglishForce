export default (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
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
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    instructor: DataTypes.TEXT,
    description: DataTypes.TEXT,
    thumbnail: DataTypes.TEXT,
    price: DataTypes.DECIMAL(10, 2)
  }, {
    tableName: 'courses',
    timestamps: false
  });

  Course.associate = function(models) {
    Course.belongsToMany(models.User, {
      through: models.UserCourse,
      foreignKey: 'course_id',
      otherKey: 'user_id'
    });
    Course.hasMany(models.UserCourse, { foreignKey: 'course_id' });

    Course.hasMany(models.CourseSection, { foreignKey: 'course_id' });
    Course.hasMany(models.Comment, { foreignKey: 'course_id' });
  };

  return Course;
};
