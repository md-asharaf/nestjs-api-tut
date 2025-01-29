import { AuthService } from './auth.service';
import { AuthDto } from 'src/auth/dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: AuthDto): Promise<{
        access_token: string;
    }>;
    signup(dto: AuthDto): Promise<{
        user: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            firstname: string | null;
            lastname: string | null;
        };
    }>;
}
