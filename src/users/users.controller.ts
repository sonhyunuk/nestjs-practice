import { Body, Controller, Delete, Get, Param,  Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {

        this.usersService.create(body.email, body.password);

    }

    @Get("/:id")
    findUser(@Param("id") id : string) {

        return this.usersService.findOne(parseInt(id));

    }

    @Get()
    findAllUUsers(@Query("email") email: string) {

        return this.usersService.find(email);

    }

    @Patch("/:id")
    updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body);

    }

    @Delete("/:id")
    removeUser(@Param("id") id: string) {

        return this.usersService.remove(parseInt(id));

    }

}
