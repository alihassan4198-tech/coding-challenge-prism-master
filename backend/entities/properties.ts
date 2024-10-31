import { DataTypes, Model, Optional } from 'sequelize';
import {sequelize} from '../sync';
import Component from './components';

// Define the attributes of the Property model
interface PropertyAttributes {
  property_id: number;
  name: string;
  default_value?: string;
  value?: string;
  state: 'default' | 'changed' | 'focused';
  unit?: string;
  description?: string;
  isRequired?: boolean;
  isInherited?: boolean;
  component_id: number;
  componentGroup?: string;
}

// Partial types for creating a new Property instance
interface PropertyCreationAttributes extends Optional<PropertyAttributes, 'property_id'> {}

// Define the Property model
class Property extends Model<PropertyAttributes, PropertyCreationAttributes> implements PropertyAttributes {
  public property_id!: number;
  public name!: string;
  public default_value?: string;
  public value?: string;
  public state!: 'default' | 'changed' | 'focused';
  public unit?: string;
  public description?: string;
  public isRequired?: boolean;
  public isInherited?: boolean;
  public component_id!: number;
  public componentGroup!: string; // e.g. "Margins & Padding"
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Property model
Property.init(
  {
    property_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    default_value: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.ENUM('default', 'changed', 'focused'),
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isInherited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    component_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Component,
        key: 'component_id',
      },
    },
    componentGroup: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Property',
    tableName: 'properties',
    timestamps: true,
  }
);

// Set up the relationship between Component and Property
Component.hasMany(Property, {
  foreignKey: 'component_id',
  as: 'properties',
});
Property.belongsTo(Component, {
  foreignKey: 'component_id',
  as: 'component',
});

export default Property;
