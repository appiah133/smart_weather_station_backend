const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WeatherReading = sequelize.define('WeatherReading', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sensor_id: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'weather_readings',
  timestamps: false,
});

module.exports = WeatherReading;