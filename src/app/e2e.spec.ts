import request, { Response } from 'supertest';

import { IProfileDataPort } from '../domain/ports/profileDataPort';
import ProfileUseCases from '../domain/profileUseCases';
import { ProfileController } from './controllers/profile.controller';
import { setupAPI } from './api';
import { Application } from 'express';
import { Profile } from '../domain/profile';

describe('Web Application', () => {
  let app: Application;
  let controller: ProfileController;
  let usecase: ProfileUseCases;
  let mockDataAdapter: IProfileDataPort;

  beforeAll(() => {
    mockDataAdapter = {
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    };

    usecase = new ProfileUseCases(mockDataAdapter);
    controller = new ProfileController(usecase);
    app = setupAPI(controller);
  });

  describe('failing PUT /profile/:id', () => {
    let response: Response;

    beforeAll(async () => {
      (mockDataAdapter.findById as jest.Mock).mockResolvedValueOnce(undefined);

      response = await request(app).put('/profile/1').send({ foo: '1' });
    });

    it('returns a not found status code', () => {
      expect(response.statusCode).toBe(404);
    });
  });

  describe('successful PUT /profile/:id', () => {
    let response: Response;
    let profile: Profile;
    let email: string;

    beforeAll(async () => {
      email = 'erick@erick.com';

      profile = new Profile(
        'foo',
        'foo@mail.com',
        'abcdef',
        true,
        {
          type: 'undocumented',
        },
        undefined,
        undefined,
        new Date(2021, 9, 10)
      );

      (mockDataAdapter.findById as jest.Mock).mockResolvedValueOnce(profile);
      (mockDataAdapter.update as jest.Mock).mockResolvedValueOnce({
        ...profile,
        email,
      });

      response = await request(app).put('/profile/1').send({
        email,
      });
    });

    it('returns a successful status code', () => {
      const isSuccessStatusCode =
        response.statusCode >= 200 && response.statusCode < 300;
      expect(isSuccessStatusCode).toBeTruthy();
    });

    it('returns the updated profile', () => {
      expect(response.body.email).toEqual(email);
    });
  });
});
