// Branch model
module.exports = (sequelize, DataTypes) => {
  const Branch = sequelize.define('Branch', {
    branch_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    company_id: { type: DataTypes.INTEGER, allowNull: false },
  }, { tableName: 'branches', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  Branch.associate = (models) => {
    Branch.belongsTo(models.Company, { foreignKey: 'company_id' });
    Branch.hasMany(models.User, { foreignKey: 'branch_id' });
  };
  return Branch;
};