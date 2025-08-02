// OrderItem model
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    order_item_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    item_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  }, { tableName: 'order_items', timestamps: false });
  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, { foreignKey: 'order_id' });
    OrderItem.belongsTo(models.MenuItem, { foreignKey: 'item_id' });
  };
  return OrderItem;
};