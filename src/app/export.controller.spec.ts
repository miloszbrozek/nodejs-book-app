import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import {AppModule} from "./app.module";
import {ImportController} from "./import.controller";

describe('ExportController', () => {
    let app: INestApplication;
    const sampleEntity = {state: 'pending'};
    let processingService = {
        getListByStates: () => [sampleEntity, sampleEntity],
        create: () => sampleEntity,
    };
    const correctPostData = {bookId: 'some id', type: "pdf"};

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider('ExportProcessingService').useValue(processingService)
            .compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();
    });

    it(`/GET by-states`, () => {
        return request(app.getHttpServer())
            .get('/export/by-states')
            .expect(200)
            .expect(processingService.getListByStates());
    });

    const sendPost = (data) => {
        return request(app.getHttpServer())
            .post('/export')
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

    it(`/POST incorrect export type`, () => {
        return sendPost({...correctPostData, type: 'some type'})
            .expect(400)
    });

    afterAll(async () => {
        await app.close();
    });
});