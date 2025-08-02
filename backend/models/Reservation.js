// Reservation model
module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define('Reservation', {
    reservation_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    branch_id: { type: DataTypes.INTEGER, allowNull: false },
    table_id: { type: DataTypes.INTEGER },
    customer_name: DataTypes.STRING,
    customer_phone: DataTypes.STRING,
    status: DataTypes.STRING,
    reserved_at: DataTypes.DATE,
  }, { tableName: 'reservations', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  Reservation.associate = (models) => {
    Reservation.belongsTo(models.Branch, { foreignKey: 'branch_id' });
    Reservation.belongsTo(models.Table, { foreignKey: 'table_id' });
  };
  return Reservation;
};