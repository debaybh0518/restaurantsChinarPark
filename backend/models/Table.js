// Table model
module.exports = (sequelize, DataTypes) => {
  const Table = sequelize.define('Table', {
    table_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    branch_id: { type: DataTypes.INTEGER, allowNull: false },
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    capacity: { type: DataTypes.INTEGER, allowNull: false },
  }, { tableName: 'tables', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  Table.associate = (models) => {
    Table.belongsTo(models.Branch, { foreignKey: 'branch_id' });
  };
  return Table;
};