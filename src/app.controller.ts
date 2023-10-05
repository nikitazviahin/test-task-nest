import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/cities')
  getCities(@Query() query): Promise<any> {
    return this.appService.getCities(query.cityFilter, query.groupByFirstName);
  }
}
