import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.shemas';
import mongoose, { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs'
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './user.interface';
import { User as UserDecorator } from 'src/decorator/customeiz'
import aqp from 'api-query-params';
import { Role, RoleDocument } from 'src/roles/schema/role.schema';
import { USER_ROLE } from 'src/databases/sample';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>

  ) { }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt)
    return hash;
  }

  async create(createUserDto: CreateUserDto, @UserDecorator() user: IUser) {
    const { name, email, password, age, gender, address, company, role } = createUserDto;
    //check email
    const isExist = await this.userModel.findOne({ email: email })
    if (isExist) {
      throw new BadRequestException(`Email: ${email} da ton tai. Vui long su dung email khac`)
    }
    const hassPassword = this.getHashPassword(createUserDto.password)
    let newUser = await this.userModel.create({
      name, email, password: hassPassword, age, gender, address, company,
      role,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return newUser;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();
    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "not found user"
    }
    return this.userModel.findOne({
      _id: id
    }).select("-password") //exclude >< include
      .populate({ path: "role", select: { name: 1, _id: 1 } })
  }

  async findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username
    }).populate({ path: "role", select: { name: 1 } })
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash)
  }

  async update(updateUserDto: UpdateUserDto, @UserDecorator() user: IUser) {

    const updated = await this.userModel.updateOne({ _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      });
    return updated
  }

  async remove(id: string, @UserDecorator() user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "not found user"
    }
    const findUser = await this.userModel.findById({ id })
    if (findUser && findUser.email === "admin@gamil.com") {
      throw new BadRequestException("khong the xoa tai khoan admin")
    }
    await this.userModel.updateOne({ _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })
    return this.userModel.softDelete(
      { _id: id },
    )
  }

  async register(user: RegisterUserDto) {
    const { name, email, password, age, gender, address } = user;
    //check email
    const isExist = await this.userModel.findOne({ email: email })
    if (isExist) {
      throw new BadRequestException(`Email: ${email} da ton tai. Vui long su dung email khac`)
    }

    //fetch user role
    const userRole = await this.roleModel.findOne({ name: USER_ROLE })

    const hassPassword = this.getHashPassword(password);
    let newRegister = await this.userModel.create({
      name, email, password: hassPassword, age, gender, address,
      role: userRole?._id
    })
    return newRegister
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne(
      { _id },
      { refreshToken }
    )
  }
  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne(
      { refreshToken }
    ).populate({
      path: "role",
      select: { name: 1 }
    })
  }

}
