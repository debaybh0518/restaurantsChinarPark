// Category model
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  }, { tableName: 'categories', timestamps: false });
  Category.associate = (models) => {
    Category.hasMany(models.MenuItem, { foreignKey: 'category_id' });
  };
  return Category;
};
// MenuItem model
module.exports = (sequelize, DataTypes) => {
  const MenuItem = sequelize.define('MenuItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 0.01 } },
    description: { type: DataTypes.TEXT, allowNull: false },
    category_id: { type: DataTypes.INTEGER, allowNull: false },
    image_url: { type: DataTypes.STRING },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, { tableName: 'menu_items', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  MenuItem.associate = (models) => {
    MenuItem.belongsTo(models.Category, { foreignKey: 'category_id' });
  };
  return MenuItem;
};
