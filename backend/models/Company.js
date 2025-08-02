// Company model
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    company_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    contact: DataTypes.STRING,
    num_branches: { type: DataTypes.INTEGER, defaultValue: 1 },
  }, { tableName: 'companies', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  Company.associate = (models) => {
    Company.hasMany(models.Branch, { foreignKey: 'company_id' });
    Company.hasMany(models.User, { foreignKey: 'company_id' });
  };
  return Company;
};