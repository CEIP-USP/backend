import { IProfileDataPort } from '../ports/profileDataPort';
import ProfileUseCases from '../profileUseCases';
import { EmailAlreadyRegisteredError } from '../exceptions/EmailAlreadyRegisteredError';
import { DocumentAlreadyRegisteredError } from '../exceptions/DocumentAlreadyRegisteredError';
import { ValidationError } from 'joi';
import crypto from 'crypto';

describe('ProfileUseCases', () => {
  describe('performPreRegistration', () => {
    const sampleData = {
      password: crypto.randomBytes(10).toString('hex'),
      name: 'John Doe',
      email: 'john.doe123@gmail.com',
      document: {
        type: 'cpf',
        value: '508.763.311-36',
      },
      phone: '11 91234-5678',
      address: 'R. do Matão, 1010 - Butantã, São Paulo - SP, 05508-090',
      dayOfSecondShot: new Date('2021-10-14T22:24:24.294Z'),
      hasSecondShot: true,
    };

    const port = {
      save: jest.fn().mockImplementation((x) => x),
      findByDocument: jest.fn().mockResolvedValueOnce(undefined),
      findByEmail: jest.fn().mockResolvedValueOnce(undefined),
    };

    beforeEach(() => {
      port.save.mockClear();
      port.findByDocument.mockClear();
      port.findByEmail.mockClear();
    });

    test('true positive', async () => {
      const useCases = new ProfileUseCases(port as unknown as IProfileDataPort);
      const result = await useCases.performPreRegistration(sampleData);

      expect(result.email).toBe(sampleData.email);
      expect(result.document.value).toBe(sampleData.document.value);
      expect(result.document.type).toBe(sampleData.document.type);
      expect(result.name).toBe(sampleData.name);
      expect(result.address).toEqual(sampleData.address);
      expect(result.phone).toBe(sampleData.phone);
      expect(result.dayOfSecondShot?.toISOString()).toEqual(
        sampleData.dayOfSecondShot.toISOString()
      );

      expect(port.save).toHaveBeenCalledTimes(1);
    });

    test('true negative (email)', async () => {
      const useCases = new ProfileUseCases(port as unknown as IProfileDataPort);

      await port.findByEmail.mockResolvedValueOnce({});
      await expect(() =>
        useCases.performPreRegistration(sampleData)
      ).rejects.toThrowError(EmailAlreadyRegisteredError);

      expect(port.save).not.toHaveBeenCalled();
      expect(port.findByEmail).toHaveBeenCalledTimes(1);
      expect(port.findByEmail).toHaveBeenCalledWith(sampleData.email);
    });

    test('true negative (document)', async () => {
      const useCases = new ProfileUseCases(port as unknown as IProfileDataPort);
      port.findByDocument.mockResolvedValueOnce({});

      await expect(() =>
        useCases.performPreRegistration(sampleData)
      ).rejects.toThrowError(DocumentAlreadyRegisteredError);

      expect(port.save).not.toHaveBeenCalled();
      expect(port.findByDocument).toHaveBeenCalledTimes(1);
      expect(port.findByDocument).toHaveBeenCalledWith(sampleData.document);
    });

    test('true negative (weak password)', async () => {
      const useCases = new ProfileUseCases(port as unknown as IProfileDataPort);

      await expect(() =>
        useCases.performPreRegistration({ ...sampleData, password: '123' })
      ).rejects.toThrowError(ValidationError);

      expect(port.save).not.toHaveBeenCalled();
      expect(port.findByEmail).not.toHaveBeenCalled();
      expect(port.findByDocument).not.toHaveBeenCalled();
    });
  });
});