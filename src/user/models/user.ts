import { DataTypes } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";
import { IRoles } from "src/interfaces/role";

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
};

export default User;
