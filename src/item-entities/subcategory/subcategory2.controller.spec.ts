import { Test, TestingModule } from '@nestjs/testing';
import { Subcategory2Controller } from './subcategory2.controller';

describe('Subcategory2Controller', () => {
  let controller: Subcategory2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Subcategory2Controller],
    }).compile();

    controller = module.get<Subcategory2Controller>(Subcategory2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
