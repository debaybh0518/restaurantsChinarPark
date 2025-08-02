// Inventory model
module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define('Inventory', {
    inventory_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    branch_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    unit: DataTypes.STRING,
    low_stock_threshold: DataTypes.DECIMAL(10,2),
  }, { tableName: 'inventory', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  Inventory.associate = (models) => {
    Inventory.belongsTo(models.Branch, { foreignKey: 'branch_id' });
  };
  return Inventory;
};