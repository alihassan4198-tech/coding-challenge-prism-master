import { DataTypes, Model, Optional } from 'sequelize';
import {sequelize} from '../sync';

// Define the attributes of the Component model
interface ComponentAttributes {
  component_id: number;
  name: string;
  type?: string;
}

// Partial types for creating a new instance, as `component_id` is auto-generated
interface ComponentCreationAttributes extends Optional<ComponentAttributes, 'component_id'> {}

// Define the Component model extending Sequelize's Model class
class Component extends Model<ComponentAttributes, ComponentCreationAttributes> implements ComponentAttributes {
  public component_id!: number;
  public name!: string;
  public type?: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Component model
Component.init(
  {
    component_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Component',
    tableName: 'components',
    timestamps: true,
  }
);

export default Component;
