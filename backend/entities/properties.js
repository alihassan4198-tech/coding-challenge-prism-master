"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var sync_1 = require("../sync");
var components_1 = require("./components");
// Define the Property model
var Property = /** @class */ (function (_super) {
    __extends(Property, _super);
    function Property() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Property;
}(sequelize_1.Model));
// Initialize the Property model
Property.init({
    property_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    default_value: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    value: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: sequelize_1.DataTypes.ENUM('default', 'changed', 'focused'),
        allowNull: false,
    },
    unit: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    isRequired: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isInherited: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    component_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: components_1.default,
            key: 'component_id',
        },
    },
    componentGroup: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: sync_1.sequelize,
    modelName: 'Property',
    tableName: 'properties',
    timestamps: true,
});
// Set up the relationship between Component and Property
components_1.default.hasMany(Property, {
    foreignKey: 'component_id',
    as: 'properties',
});
Property.belongsTo(components_1.default, {
    foreignKey: 'component_id',
    as: 'component',
});
exports.default = Property;
