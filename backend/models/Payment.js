// Payment model
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    payment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    status: DataTypes.STRING,
    method: DataTypes.STRING,
    billdesk_txn_id: DataTypes.STRING,
    amount: DataTypes.DECIMAL(10,2),
  }, { tableName: 'payments', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });
  Payment.associate = (models) => {
    Payment.belongsTo(models.Order, { foreignKey: 'order_id' });
  };
  return Payment;
};