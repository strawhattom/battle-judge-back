/* eslint-disable no-undef */
const service = require('./users.service');
const User = require('./users.model');
const Sequelize = require('sequelize');
const UndefinedError = require('../errors/UndefinedError');
const WrongFormatError = require('../errors/WrongFormatError');
const DuplicateError = require('../errors/DuplicateError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

beforeEach(() => {
  User.findOne.mockClear();
  User.findByPk.mockClear();
  User.findAll.mockClear();
  User.create.mockClear();
});

const _userTemplate = {
  id: '1',
  username: 'user',
  email: 'common@dns.com',
  role: 'participant',
  team: null
};

const _mockUser = {
  role: 'participant',
  team: 1,
  id: 1,
  username: 'user',
  password: '$2b$10$uv.TXMXuQvC93dU0RRR/s.YM.9R9h9bQJZsWSkFM8A8YPQ9nWEZX2',
  email: 'user@dns.com'
};

jest.mock('./users.model');

describe('Fetch service', () => {
  it('Should return all users', async () => {
    User.findAll.mockResolvedValue([_userTemplate]);
    expect(await service.findAll()).toStrictEqual([_userTemplate]);
    expect(User.findAll).toHaveBeenCalled();
  });
  it('Should return the user with its primary key', async () => {
    User.findByPk.mockResolvedValue(_mockUser);
    expect(await service.findById(_mockUser.id)).toStrictEqual(_mockUser);
    expect(User.findByPk).toHaveBeenCalled();
  });
  it('Should return the user with its username', async () => {
    User.findOne.mockResolvedValue(_mockUser);
    expect(await service.findByName(_mockUser.username)).toStrictEqual(
      _mockUser
    );
    expect(User.findOne).toHaveBeenCalled();
  });
  it('Should throw error when the user id does not exist', async () => {
    User.findByPk.mockResolvedValue(null);
    await expect(service.findById(-1)).rejects.toThrow(NotFoundError);
    expect(User.findByPk).toHaveBeenCalled();
  });
  it('Should throw error when the username does not exist', async () => {
    User.findOne.mockResolvedValue(null);
    await expect(service.findByName('notexisting')).rejects.toThrow(
      NotFoundError
    );
    expect(User.findOne).toHaveBeenCalled();
  });
  it('Should return all participants', async () => {
    User.findAll.mockResolvedValue([_mockUser]);
    expect(await service.findAllParticipants()).toStrictEqual([_mockUser]);
    expect(User.findAll).toHaveBeenCalled();
  });
  it('Should return all judges', async () => {
    User.findAll.mockResolvedValue([]);
    expect(await service.findAllJudges()).toStrictEqual([]);
    expect(User.findAll).toHaveBeenCalled();
  });
});

describe('Register service', () => {
  it('Should register user', async () => {
    User.create.mockResolvedValue(_mockUser);
    expect(
      await service.register(
        _mockUser.username,
        _mockUser.password,
        _mockUser.email
      )
    ).toStrictEqual(_mockUser);
    expect(User.create).toHaveBeenCalled();
  });
  it('Should throw error with undefined parameters', async () => {
    await expect(service.register()).rejects.toThrow(UndefinedError);
    expect(User.create).not.toHaveBeenCalled();
  });
  it('Should throw error with incorrect email format', async () => {
    User.create.mockRejectedValue(new Sequelize.ValidationError());
    await expect(
      service.register(_mockUser.username, _mockUser.password, 'userdns.com')
    ).rejects.toThrow(WrongFormatError);
    expect(User.create).toHaveBeenCalled();
  });
  it('Should throw error with existing username', async () => {
    User.create.mockRejectedValue(new Sequelize.UniqueConstraintError());
    await expect(
      service.register(_mockUser.username, _mockUser.password, _mockUser.email)
    ).rejects.toThrow(DuplicateError);
    expect(User.create).toHaveBeenCalled();
  });
});
