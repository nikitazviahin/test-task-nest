import { Inject, Injectable } from '@nestjs/common';
import { PG_CONNECTION } from './constants/db';

@Injectable()
export class AppService {
  constructor(@Inject(PG_CONNECTION) private conn: any) {}

  async getCities() {
    const res = await this.conn.query('SELECT * FROM cities');
    return res.rows;
  }
}
