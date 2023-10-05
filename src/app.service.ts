import { Inject, Injectable } from '@nestjs/common';
import { PG_CONNECTION } from './constants/db';

interface INameByCityCount {
  city: string;
  first_name: string;
  count: number;
}

@Injectable()
export class AppService {
  constructor(@Inject(PG_CONNECTION) private conn: any) {}

  async getCities(cityFilter: string, groupByFirstName: boolean) {
    const isFilterUsed = !cityFilter || cityFilter === '' ? false : true;

    const cityPopulationSqlQuery = this.getSqlQueryForCityPopulation(
      isFilterUsed,
      cityFilter,
    );
    const cityPopulationRawResult = await this.conn.query(
      cityPopulationSqlQuery,
    );
    const cityPopulationResult = cityPopulationRawResult.rows;

    const cityMembersSqlQuery = this.getSqlQueryForCityMembers(
      isFilterUsed,
      cityFilter,
    );
    const cityMembersRawResult = await this.conn.query(cityMembersSqlQuery);
    const cityMembersResult = this.groupCityMembersByFirstName(
      cityMembersRawResult.rows,
    );

    return groupByFirstName
      ? {
          city_members: cityMembersResult,
        }
      : {
          cities_population: cityPopulationResult,
        };
  }

  private getSqlQueryForCityMembers(
    isFilterUsed: boolean,
    cityFilter: string,
  ): string {
    const cityMembersSqlArray = [
      `SELECT name as city, first_name, COUNT(*) as count
    FROM residents INNER JOIN cities
    ON residents.city_id = cities.id`,
    ];
    if (isFilterUsed) {
      cityMembersSqlArray.push(
        `WHERE LOWER(name) LIKE LOWER('%${cityFilter}%')`,
      );
    }
    cityMembersSqlArray.push(`GROUP BY city, first_name`);

    return cityMembersSqlArray.join(` `);
  }

  private getSqlQueryForCityPopulation(
    isFilterUsed: boolean,
    cityFilter: string,
  ): string {
    const cityPopulationSqlArray = [
      `SELECT name as city, COUNT(*) as count
    FROM residents INNER JOIN cities
    ON residents.city_id = cities.id`,
    ];
    if (isFilterUsed) {
      cityPopulationSqlArray.push(
        `WHERE LOWER(name) LIKE LOWER('%${cityFilter}%')`,
      );
    }
    cityPopulationSqlArray.push(`GROUP BY name`);

    return cityPopulationSqlArray.join(` `);
  }

  private groupCityMembersByFirstName(
    nameByCityCountArray: INameByCityCount[],
  ) {
    const resultingObject = {};

    for (const el of nameByCityCountArray) {
      const isCityPresent = resultingObject[el.city];
      if (!isCityPresent) {
        resultingObject[el.city] = [
          {
            first_name: el.first_name,
            count: el.count,
          },
        ];
      } else {
        resultingObject[el.city] = [
          ...resultingObject[el.city],
          {
            first_name: el.first_name,
            count: el.count,
          },
        ];
      }
    }

    const groupedCityMembers = Object.entries(resultingObject).map((el) => {
      return {
        city: el[0],
        members: el[1],
      };
    });
    return groupedCityMembers;
  }
}
