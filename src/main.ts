import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;
  const config = new DocumentBuilder()
    .setTitle('back for bybus')
    .setDescription('Vos billets en un click')
    .setVersion('1.0')
    .addTag('Billet')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document,{
    swaggerOptions: {
      requestInterceptor: (req) => {
        req.credentials = 'include';
        return req;
      },
    },
  });


  app.use(helmet());
  app.enableCors({
    origin:process.env.CORS.split(','),
    credentials:true,
  });
  await app.listen(process.env.PORT);
  console.log(
    `Pour la connection a swagger:http://localhost:${PORT}/api`,
  );
}
bootstrap();
