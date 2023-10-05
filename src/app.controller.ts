import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/cities')
  getHello(@Query() query): Promise<any> {
    return this.appService.getCities(query.cityFilter, query.groupByFirstName);
  }
}
