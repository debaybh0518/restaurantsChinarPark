// Order (KOT) model
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    total_price: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Pending' },
  }, { tableName: 'orders', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  Order.associate = (models) => {
    Order.belongsToMany(models.MenuItem, { through: models.OrderMenuItem, foreignKey: 'order_id' });
  };
  return Order;
};
// OrderMenuItem join model
module.exports = (sequelize, DataTypes) => {
  const OrderMenuItem = sequelize.define('OrderMenuItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    menu_item_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  }, { tableName: 'order_menu_items', timestamps: false });
  return OrderMenuItem;
};
