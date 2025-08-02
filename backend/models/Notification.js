// Notification model
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    notification_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER },
    type: DataTypes.STRING,
    message: DataTypes.TEXT,
    status: DataTypes.STRING,
    sent_at: DataTypes.DATE,
  }, { tableName: 'notifications', timestamps: true, createdAt: 'created_at', updatedAt: false });
  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: 'user_id' });
  };
  return Notification;
};