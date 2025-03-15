import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
      .setTitle('Library API')
      .setDescription('API documentation for the library system')
      .setVersion('1.0')
      .addTag('library')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT ?? 3000);
    console.log(
      `Swagger UI available at http://localhost:${process.env.PORT ?? 3000}/api`,
    );
  } catch (error: unknown) {
    console.error('Error starting the application:', error);
    process.exit(1);
  }
}

void bootstrap();
