import { DepartmentsController } from './departments.controller';

describe('DepartmentsController', () => {
  it('delegates findAll to the service', async () => {
    const service = { findAll: jest.fn().mockResolvedValue(['CTO']) };
    const controller = new DepartmentsController(service as never);
    await expect(controller.findAll()).resolves.toEqual(['CTO']);
    expect(service.findAll).toHaveBeenCalled();
  });
});
