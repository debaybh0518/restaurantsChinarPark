// Order model
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    order_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    branch_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER },
    table_id: { type: DataTypes.INTEGER },
    status: DataTypes.STRING,
    type: DataTypes.STRING,
    total: DataTypes.DECIMAL(10,2),
  }, { tableName: 'orders', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  Order.associate = (models) => {
    Order.belongsTo(models.Branch, { foreignKey: 'branch_id' });
    Order.belongsTo(models.User, { foreignKey: 'user_id' });
    Order.hasMany(models.OrderItem, { foreignKey: 'order_id' });
  };
  return Order;
};