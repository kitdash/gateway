const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { ValidationPipe } = require('@nestjs/common');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api');
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Gateway running on port ${port}`);
}
bootstrap();