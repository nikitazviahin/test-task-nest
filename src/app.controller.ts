import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger/dist';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('cities')
  @Get('/cities')
  @ApiOperation({ summary: 'Get cities population' })
  @ApiResponse({
    status: 200,
    description: 'The information about cities',
  })
  @ApiQuery({ name: 'cityFilter', type: String })
  @ApiQuery({ name: 'groupByFirstName', type: Boolean })
  getCities(@Query() query): Promise<any> {
    return this.appService.getCities(query.cityFilter, query.groupByFirstName);
  }
}
