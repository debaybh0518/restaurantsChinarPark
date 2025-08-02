// Menu model
module.exports = (sequelize, DataTypes) => {
  const Menu = sequelize.define('Menu', {
    menu_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    branch_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    category: DataTypes.STRING,
    available: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, { tableName: 'menus', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  Menu.associate = (models) => {
    Menu.belongsTo(models.Branch, { foreignKey: 'branch_id' });
    Menu.hasMany(models.MenuItem, { foreignKey: 'menu_id' });
  };
  return Menu;
};