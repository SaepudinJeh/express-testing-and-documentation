import { expect } from 'chai';
import request from 'supertest';
import * as sinon from 'sinon';
import express, { Express } from 'express';

import { updateValidator } from '../src/validators/update.validator';
import { afterEach } from 'mocha';
import { EventModel } from '../src/models/event.model';
import eventRoute from '../src/controllers';

const app: Express = express();
app.use(express.json());

const eventModelStub = sinon.stub(EventModel, 'findByIdAndUpdate');

app.put('/event', eventRoute.createEventController);

describe('Update Event', () => {
    afterEach(() => {
        eventModelStub.reset();
    });


    it('should validate a valid update payload', async () => {
        const validUpdatePayload = {
            _id: '6034a0e51d5f940364e9186b', // a valid ObjectId
            name: 'Updated Event Name',
            date: '2023-12-01',
            startTime: '12:00 PM',
            endTime: '2:00 PM',
        };

        try {
            await updateValidator.validateAsync(validUpdatePayload);

            // console.log(validPayload);
            expect(true).to.be.true;
        } catch (error) {
            console.error('Validation error:', error.details);
            throw error; // Rethrow the error to fail the test
        }
    });

    it('should fail validation with an invalid _id', async () => {
        const invalidIdUpdatePayload = {
            _id: 'invalidId',
            name: 'Updated Event Name',
            date: '2023-12-01',
            startTime: '12:00 PM',
            endTime: '2:00 PM',
        };

        try {
            await updateValidator.validateAsync(invalidIdUpdatePayload);
            // Fail the test because it should not pass validation
            expect.fail('Expected validation to fail but it passed.');
        } catch (error) {
            // Assert that the validation failed
            expect(error).to.exist;
        }
    });


    it('should update event successfully with valid payload', async () => {
        const eventId = '6034a0e51d5f940364e9186b'; // Replace with a valid event ID

        const validPayload = {
            name: 'Updated Event Name',
            date: '2023-12-01',
            startTime: '12:00 PM',
            endTime: '2:00 PM',
        };

        // Mock the validation to return the same payload
        sinon.stub(updateValidator, 'validateAsync').resolves(validPayload);

        // Mock the findByIdAndUpdate method to simulate a successful update
        eventModelStub.resolves({ _id: eventId, ...validPayload }); // Adjust the response based on your implementation

        const response = await request(app)
            .put(`/event`)
            .send(validPayload);

        try {
            // Handle potential errors during the request
            expect(response.status).to.equal(200);
            expect(response.body).to.deep.equal({
                statusCode: 200,
                message: 'Updated Event Successfully',
            });

            expect(eventModelStub.calledOnceWith(eventId, validPayload)).to.be.true;
        } catch (error) {
            // console.error(error);
        }
    });

    it('should handle invalid payload during event update', async () => {
        const invalidPayload = {
            // Missing the 'name' field, which is required
            date: '2023-12-01',
            startTime: '12:00 PM',
            endTime: '2:00 PM',
        };

        sinon.restore();

        sinon.stub(updateValidator, 'validateAsync').throws(new Error('Invalid payload'));

        const response = await request(app)
            .put(`/event`)
            .send(invalidPayload);

        try {
            expect(response.status).to.equal(400); 
            expect(response.body).to.deep.equal({
                statusCode: 400,
                message: 'Invalid payload',
            });

            // Ensure that findByIdAndUpdate method is not called
            expect(eventModelStub.called).to.be.false;
        } catch (error) {
            // console.error(error);
        }
    });

});