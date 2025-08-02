// AuditLog model
module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    log_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    actor_id: { type: DataTypes.INTEGER },
    action: DataTypes.STRING,
    entity: DataTypes.STRING,
    entity_id: DataTypes.INTEGER,
  }, { tableName: 'audit_logs', timestamps: true, createdAt: 'created_at', updatedAt: false });
  AuditLog.associate = (models) => {
    AuditLog.belongsTo(models.User, { foreignKey: 'actor_id' });
  };
  return AuditLog;
};