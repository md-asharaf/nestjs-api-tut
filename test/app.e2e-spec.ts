import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
describe('App e2e test', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(async () => {
    await app.close();
  });
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'asharaf@gmail.com',
      password: '123456',
    };
    describe('POST /auth/signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400).
          inspect();
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400)
          .inspect();
      });
      it('should throw if both email and password empty', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should create user', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          .inspect();
      });
    });
    describe('POST /auth/login', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400)
          .inspect();
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400)
          .inspect();
      });
      it('should throw if both email and password empty', () => {
        return pactum.spec().post('/auth/login').expectStatus(400);
      });
      it('should return access_token', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .stores('access_token', 'access_token')
          .expectStatus(200)
          .inspect();
      });
    });
  });
  describe('User', () => {
    describe('GET /users/me', () => {
      it('should return user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: `Bearer $S{access_token}`,
          })
          .expectStatus(200);
      });
    });
    describe('PATCH /users', () => {
      const dto: EditUserDto = {
        email: 'asharaf.dev@gmail.com',
        lastName: 'Asharaf',
        firstName: 'Muhammad',
      };
      it('should return edited user', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: `Bearer $S{access_token}`,
          })
          .withBody(dto)
          .expectStatus(200)
          .inspect();
      });
    });
  });
  describe('Bookmark', () => {
    describe('POST /bookmarks/create', () => {});
    describe('DELETE /bookamrks/delete', () => {});
    describe('GET /bookmarks/id', () => {});
    describe('PATCH /bookamrks/edit', () => {});
  });
});
