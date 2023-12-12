// Import necessary Sequelize modules
import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/database';

enum DiscountType {
  FIXED_AMOUNT = 'fixedAmount',
  PERCENT = 'percent',
  MIXED = 'mixed',
}

type IDiscounts = { type: DiscountType; amount?: number; percent?: number;};
// Coupon model
class CouponModel extends Model {
  public id!: number;
  public code!: string;
  public rules!: { totalPrice?: number; itemCount?: number };
  public discounts!: IDiscounts;
}

// The Coupon attributes
CouponModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    rules: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    discounts: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Coupon',
    tableName: 'coupons',
    createdAt: true,
    updatedAt: true
  }
);

// Create the table if it doesn't exist
CouponModel.sync();

export { CouponModel, DiscountType, IDiscounts };
