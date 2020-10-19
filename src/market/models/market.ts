import { DataTypes } from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import User from "src/user/models/user";
import { enumToArray } from "src/utils";
import { IMarketCategories } from "../interfaces/market";

@Table
class Market extends Model<Market> {
  @Column
  name: string;

  @Column({ type: DataTypes.TEXT })
  description: string;

  @Column
  address: string;

  @Column({ allowNull: false, type: DataTypes.ENUM(...enumToArray(IMarketCategories)) })
  category: IMarketCategories;

  @Column({ allowNull: false, type: DataTypes.NUMBER })
  longitude: number;

  @Column({ allowNull: false, type: DataTypes.NUMBER })
  latitude: number;

  @Column({ type: DataTypes.ARRAY(DataTypes.STRING) })
  images: string[];

  @Column
  @ForeignKey(() => User)
  ownerId: string;

  @BelongsTo(() => User)
  owner: User
};

export default Market;
