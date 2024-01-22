import { Controller, Get, Header } from '@nestjs/common';
import Redis from 'ioredis';

const client = new Redis(process.env.REDIS_SERVER);
client.on('error', (err) => console.log('Redis Client Error', err));

@Controller('api/clicks')
export class ClicksController {
  @Get()
  @Header('Content-type', 'application/json')
  @Header('Access-Control-Allow-Origin', '*')
  async clicks() {
    const clicks = parseInt(await client.get('clicks')) || 0;
    return { clicks };
  }

  @Get('incr')
  @Header('Content-type', 'application/json')
  @Header('Access-Control-Allow-Origin', '*')
  async incr() {
    await client.incr('clicks');
    const clicks = parseInt(await client.get('clicks'));
    return { clicks };
  }
}
