import { DataTypes } from "sequelize";
import { Column, HasMany, Model, Table } from "sequelize-typescript";
import { IRoles } from "src/interfaces/role";
import Market from "src/market/models/market";

@Table
class User extends Model<User> {
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  email: string;

  @Column({ allowNull: false })
  password: string;

  @Column({ type: DataTypes.ARRAY(DataTypes.STRING) })
  roles: IRoles[];

  @HasMany(() => Market)
  markets: Market[]
};

export default User;
