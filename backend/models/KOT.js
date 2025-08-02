// KOT model
module.exports = (sequelize, DataTypes) => {
  const KOT = sequelize.define('KOT', {
    kot_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    status: DataTypes.STRING,
  }, { tableName: 'kots', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  KOT.associate = (models) => {
    KOT.belongsTo(models.Order, { foreignKey: 'order_id' });
  };
  return KOT;
};