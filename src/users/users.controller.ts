import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    NotFoundException, 
    Param,  
    Patch, 
    Post, 
    Query,
    Session,
    UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(
        private usersService: UsersService,
        private AuthService: AuthService
    ) {}

    @UseGuards(AuthGuard)
    @Get('/whoami')
    whoAmI(@CurrentUser() user : User) {

        return user
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session) {

        const user = await this.AuthService.signUp(body.email, body.password);
        session.userId = user.id; 
        return user
    }

    @Get('/signout') 
    signOut(@Session() session) {

        session.userId = null;

    }

    @Post('/signin')
    async signIn(@Body() body: CreateUserDto, @Session() session) {

        const user = await this.AuthService.signIn(body.email, body.password);
        session.userId = user.id; 
        return user
    }

    @Get("/:id")
    async findUser(@Param("id") id : string) {

        const user = await this.usersService.findOne(parseInt(id));
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    @Get()
    findAllUsers(@Query("email") email: string) {

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
