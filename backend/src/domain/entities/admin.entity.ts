import { RoleEnum } from "../../application/interfaces/enums/role.enum";

export interface AdminProps {
   id?: string;
   name?: string;
   username: string;
   password: string;
   role: RoleEnum.ADMIN;
   avatar?: string;
}

export class AdminEntity {
   private readonly _id?: string;
   private readonly _name?: string;
   private readonly _username: string;
   private _password: string;
   private readonly _role: RoleEnum.ADMIN;
   private readonly _avatar?: string;
   
   constructor ( props: AdminProps ) {
      this._id = props.id;
      this._name = props.name;
      this._username = props.username;
      this._password = props.password;
      this._role = props.role;
      this._avatar = props.avatar;
   }
   
   // 👇 Public Getters
   get id (): string | undefined {
      return this._id;
   }
   
   get name (): string | undefined {
      return this._name;
   }
   
   get username (): string {
      return this._username;
   }
   
   get password (): string {
      return this._password;
   }
   
   get role (): RoleEnum.ADMIN {
      return this._role;
   }
   
   get avatar (): string | undefined {
      return this._avatar;
   }
   
   // 🔒 You can allow password update
   updatePassword ( newPassword: string ) {
      this._password = newPassword;
   }
}
