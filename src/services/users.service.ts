import { compare, hash } from 'bcrypt';
import { CangePasswordDto, CreateUserDto, UpdateRoleDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import userModel from '@models/users.model';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { UserFlags } from '@/interfaces/users.interface';

class UserService {
  public users = userModel;

  public async changePaswword(req: RequestWithUser): Promise<any> {
    const { password, changePassword } = req.body as CangePasswordDto
    const isPasswordMatching: boolean = await compare(password, req.user.password);
    if (!isPasswordMatching) throw new HttpException(409, "기존 비밀번호가 올바르지 않습니다");
    const hashedPassword = await hash(changePassword, 10);
    await this.users.updateOne({_id: req.user._id}, {$set: {password: hashedPassword}})
    return true
  }

  public async getUsers(req: RequestWithUser): Promise<any> {
    const users = await this.users.find({}, {name: 1, _id: 1, id: 1, flags: 1})
    return users;
  }

  public async updateRole(req: RequestWithUser): Promise<any> {
    const { role } = req.body as UpdateRoleDto
    const { userId } = req.params
    if(userId === req.user._id.toString()) throw new HttpException(404, "자신은 수정이 불가능합니다");
    const user = await this.users.findOne({_id: userId})
    if(!user) throw new HttpException(404, "찾을 수 없는 유저입니다");
    const getFlag = () => {
      if(role === "teacher") {
        return UserFlags.teacher
      } else if(role === "admin") {
        return UserFlags.teacher + UserFlags.admin
      }
    }
    await user.update({$set: {flags: getFlag()}})
    return null;
  }
}

export default UserService;
