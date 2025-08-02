// User model
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    role_id: { type: DataTypes.INTEGER, allowNull: false },
    company_id: { type: DataTypes.INTEGER, allowNull: false },
    branch_id: { type: DataTypes.INTEGER },
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
  }, { tableName: 'users', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: 'role_id' });
    User.belongsTo(models.Company, { foreignKey: 'company_id' });
    User.belongsTo(models.Branch, { foreignKey: 'branch_id' });
  };
  return User;
};