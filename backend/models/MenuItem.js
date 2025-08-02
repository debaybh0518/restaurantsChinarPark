// MenuItem model
module.exports = (sequelize, DataTypes) => {
  const MenuItem = sequelize.define('MenuItem', {
    item_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    menu_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    description: DataTypes.TEXT,
    available: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, { tableName: 'menu_items', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  MenuItem.associate = (models) => {
    MenuItem.belongsTo(models.Menu, { foreignKey: 'menu_id' });
  };
  return MenuItem;
};