import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import {AppModule} from "./app.module";
import {ImportController} from "./import.controller";

describe('ImportController', () => {
    let app: INestApplication;
    const sampleEntity = {state: 'pending'};
    let processingService = {
        getListByStates: () => [sampleEntity, sampleEntity],
        create: () => sampleEntity,
    };
    const correctPostData = {bookId: 'some id', type: "word", url: 'http://google.com'};

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider('ImportProcessingService').useValue(processingService)
            .compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();
    });

    it(`/GET by-states`, () => {
        return request(app.getHttpServer())
            .get('/import/by-states')
            .expect(200)
            .expect(processingService.getListByStates());
    });

    const sendPost = (data) => {
        return request(app.getHttpServer())
            .post('/import')
            .send(data)
    }

    it(`/POST correct`, () => {
        return sendPost(correctPostData)
            .expect(201)
            .expect(processingService.create());
    });

    it(`/POST no book id`, () => {
        const {bookId, ...rest} = correctPostData;
        return sendPost(rest)
            .expect(400)
    });

    it(`/POST incorrect url`, () => {
        return sendPost({...correctPostData, url: 'some value'})
            .expect(400)
    });

    it(`/POST incorrect import type`, () => {
        return sendPost({...correctPostData, type: 'some type'})
            .expect(400)
    });

    afterAll(async () => {
        await app.close();
    });
});