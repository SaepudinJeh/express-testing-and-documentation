import { expect } from 'chai';
import request from 'supertest';
import * as sinon from 'sinon';
import express, { Express } from 'express';

import { EventModel } from '../src/models/event.model';
import { postValidator } from '../src/validators/post.validator';
import eventRoute from '../src/controllers';
import { afterEach } from 'mocha';

const app: Express = express();
app.use(express.json());

// Mocking the EventModel.create method to avoid actual database operations in tests
const eventModelStub = sinon.stub(EventModel, 'create');

app.post('/event', eventRoute.createEventController);

describe('Create Event', () => {
    afterEach(() => {
        eventModelStub.reset();
    });

    it('should have a valid body from payload', async () => {
        const validPayload = {
            name: 'Event Name',
            date: '2023-12-01',
            startTime: '10:00 AM',
            endTime: '12:00 PM',
        };

        try {
            await postValidator.validateAsync(validPayload);

            expect(true).to.be.true;
        } catch (error) {
            console.error('Validation error:', error.details);
            throw error;
        }
    });

    it('should fail with invalid body from payload', async () => {
        const invalidPayload = {
            date: '2023-12-01',
            startTime: '10:00 AM',
            endTime: '12:00 PM',
        };

        try {
            await postValidator.validateAsync(invalidPayload);
            expect.fail('Expected validation to fail but it passed.');
        } catch (error) {
            expect(error).to.exist;
        }
    });

    it('should create an event successfully with valid payload', async () => {
        const validPayload = {
            name: 'Event Name',
            date: '2023-12-01',
            startTime: '10:00 AM',
            endTime: '12:00 PM',
        };

        // Mock the validation to return the same payload
        sinon.stub(postValidator, 'validateAsync').resolves(validPayload);

        // Perform the request using supertest
        const response = await request(app)
            .post('/event')
            .send(validPayload);

        expect(response.status).to.equal(201);
        expect(response.body).to.deep.equal({
            statusCode: 201,
            message: 'Created Event Successfully',
        });

        // Verify that the EventModel.create method was called with the validated payload
        expect(eventModelStub.calledOnceWith(validPayload)).to.be.true;
    });

    it('should handle validation error and return an appropriate response', async () => {
        const invalidPayload = {
            // Include an invalid field or omit a required field
            date: '2023-12-01',
            startTime: '10:00 AM',
            endTime: '12:00 PM',
        };

        // Restore the original validateAsync method before stubbing it again
        sinon.restore();

        // Mock the validation to throw an error
        sinon.stub(postValidator, 'validateAsync').rejects(new Error('Validation Error'));

        // Perform the request using supertest
        const response = await request(app)
            .post('/event')
            .send(invalidPayload);

        expect(response.status).to.equal(500);
    });
});
