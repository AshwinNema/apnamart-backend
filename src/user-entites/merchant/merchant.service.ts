import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { QueryMerchants } from 'src/validations';
import { getQueryMerchantArgs } from './utils';

@Injectable()
export class MerchantService {
  constructor(private commonService: CommonService) {}

  async queryMerchants(query: QueryMerchants) {
    return this.commonService.queryData(...getQueryMerchantArgs(query));
  }
}
