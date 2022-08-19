import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';

// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import  Users from '../database/models';

import { Response } from 'superagent';
import { StatusCodes } from 'http-status-codes';
import { Model } from 'sequelize/types';

chai.use(chaiHttp);

const { expect } = chai;

const validAdmin = {id: 1, username:' Admin', role: 'admin', email:'admin@admin.com', password:'$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW' };
const validUser =  {id:2, username: 'User', role:'user', email: 'user@user.com', password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO'};

let chaiHttpResponse: Response;

describe('POST /login on success', () => {

  beforeEach(async () => {
    sinon
      .stub(Users, "set")
      .resolves(null as typeof Users | null);
    sinon
    .stub(bcrypt, 'compare')
    .resolves(true);
  });

  afterEach(()=>{
    sinon.restore();
  })

  it('should return a status 200', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login').send({
        email: validAdmin.email,
        password: 'secret_admin'
      });
    expect(chaiHttpResponse.status.valueOf()).to.be.equal(200)
  });

  it('should return a token', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login').send({
        email: validAdmin.email,
        password: 'secret_admin'
      });;
    expect(chaiHttpResponse.body).to.haveOwnProperty('token');
  });
});

describe('POST /login on fail', () => {
  describe('when the fields are empty', () => {
    beforeEach( async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/login').send();
    })
    afterEach(sinon.restore)
    it('should return status 400 on empty fields', () => {
      expect(chaiHttpResponse.status.valueOf()).to.be.equal(400);
    })
    it('should return an object with the message "All fields must be filled"', () => {
      expect(chaiHttpResponse.body).to.haveOwnProperty("message");
      expect(chaiHttpResponse.body.message).to.be.equal("All fields must be filled");
    })
  })
  })