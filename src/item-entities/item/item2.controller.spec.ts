import { Test, TestingModule } from '@nestjs/testing';
import { Item2Controller } from './item2.controller';

describe('Item2Controller', () => {
  let controller: Item2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Item2Controller],
    }).compile();

    controller = module.get<Item2Controller>(Item2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
