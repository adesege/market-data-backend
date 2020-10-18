import { Injectable } from "@nestjs/common";
import { IRoles } from "src/interfaces/role";
import { BaseGuard } from "./base.guard";

@Injectable()
export class UserGuard extends BaseGuard(IRoles.USER) { }
