import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { UsersService } from './users.services';
import { User } from '../schemas/users,scheme';
import { UserDto } from './dto/user.dto';
import { Roles } from '../decorators/roles.decorators';
import { UserRoles } from '../constants/users-role.enum';
import { UserLoginDto } from './dto/userr-login.dto';
import { UsersGuards } from '../guards/users.guards';
import { RolesGuard } from '../guards/roles.guard';

@Controller('users')
@ApiTags('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all users',
    type: [UserDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  getAll(): Promise<User[]> {
    return this.usersService.getAll();
  }

  @Roles(UserRoles.Admin, UserRoles.User)
  @UseGuards(UsersGuards)
  @UseGuards(RolesGuard)
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get user by id',
    type: UserDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  getOne(@Param('id') id: string): Promise<User> {
    return this.usersService.getById(id);
  }

  @Post()
  @ApiBody({ type: CreateUsersDto })
  @ApiResponse({
    status: 201,
    description: 'Get new users',
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  create(@Body(new ValidationPipe()) user: CreateUsersDto): Promise<User> {
    return this.usersService.create(user);
  }

  @Roles(UserRoles.Admin, UserRoles.User)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @ApiResponse({
    status: 200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id);
  }

  @Roles(UserRoles.Admin, UserRoles.User)
  @UseGuards(RolesGuard)
  @Put(':id')
  @ApiResponse({
    status: 201,
    description: 'Update and get new user',
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: UpdateUsersDto })
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUser: UpdateUsersDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUser);
  }

  @Post('/userName')
  @ApiBody({ type: UserLoginDto })
  getUserLogin(@Body() login: UserLoginDto) {
    return this.usersService.getByLogin(login);
  }
}
