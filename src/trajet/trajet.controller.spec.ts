import { Test, TestingModule } from '@nestjs/testing';
import { TrajetController } from './trajet.controller';
import { TrajetService } from './trajet.service';

describe('TrajetController', () => {
  let controller: TrajetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrajetController],
      providers: [TrajetService],
    }).compile();

    controller = module.get<TrajetController>(TrajetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
