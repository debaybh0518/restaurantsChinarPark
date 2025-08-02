// Role model
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    role_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
  }, { tableName: 'roles', timestamps: false });
  Role.associate = (models) => {
    Role.hasMany(models.User, { foreignKey: 'role_id' });
  };
  return Role;
};