import { expect } from 'chai';
import * as sinon from 'sinon';

import { byIdValidator } from '../src/validators/byId.validator';
import { EventModel } from '../src/models/event.model';
import { NextFunction, Request, Response } from 'express';
import { findEventController, findEventsController } from '../src/controllers/get.controller';

describe('Get Event', () => {
    it('should validate a valid _id', async () => {
        const payload = {
            _id: '6034a0e51d5f940364e9186b'
        }

        try {
            await byIdValidator.validateAsync(payload);
            expect(true).to.be.true;
        } catch (error) {
            console.error('Validation error:', error.details);
            throw error;
        }
    })

    it('should fail validation with an invalid _id', async () => {
        const invalidIdPayload = {
            _id: 'invalidId',
        };

        try {
            await byIdValidator.validateAsync(invalidIdPayload);
            expect.fail('Expected validation to fail but it passed.');
        } catch (error) {
            expect(error).to.exist;
        }
    });
});

describe('Event Controllers', () => {
    describe('findEventsController', () => {
        it('should return a list of events', async () => {
            // Mock EventModel.find to return a sample list of events
            const sampleEvents = [{ _id: '1', name: 'Event 1' }, { _id: '2', name: 'Event 2' }];
            const findStub = sinon.stub(EventModel, 'find').resolves(sampleEvents);

            // Mock Express response object
            const res: Partial<Response> = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            // Invoke the controller
            await findEventsController({} as Request, res as Response, {} as NextFunction);

            // Assert the expected behavior
            expect((res.status as sinon.SinonStub).calledWith(200)).to.be.true;
            expect((res.json as sinon.SinonStub).calledWith({
                statusCode: 200,
                message: 'Get Events Successfully',
                data: sampleEvents,
            })).to.be.true;

            findStub.restore();
            // Restore the stub
            findStub.restore();
        });

        it('should handle errors and call next', async () => {
            // Mock EventModel.find to throw an error
            const findStub = sinon.stub(EventModel, 'find').throws(new Error('Test Error'));

            // Mock Express next function
            const next: sinon.SinonSpy = sinon.spy();

            // Invoke the controller
            await findEventsController({} as Request, {} as Response, next);

            // Assert the expected behavior
            expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;

            // Restore the stub
            findStub.restore();
        });
    });

    describe('findEventController', () => {
        it('should return a single event', async () => {
            // Mock byIdValidator.validateAsync to return a sample _id
            const sampleId = '1';
            const validateStub = sinon.stub(byIdValidator, 'validateAsync').resolves({ _id: sampleId });

            // Mock EventModel.findById to return a sample event
            const sampleEvent = { _id: sampleId, name: 'Sample Event' };
            const findByIdStub = sinon.stub(EventModel, 'findById').resolves(sampleEvent);

            // Mock Express response object
            const res: Partial<Response> = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            // Invoke the controller
            await findEventController({ body: {} } as Request, res as Response, {} as NextFunction);

            expect((res.status as sinon.SinonStub).calledWith(200)).to.be.true;
            expect((res.json as sinon.SinonStub).calledWith({
                statusCode: 200,
                message: 'Get Event Successfully',
                data: sampleEvent,
            })).to.be.true;

            // Restore the stubs
            validateStub.restore();
            findByIdStub.restore();
        });

        it('should handle errors and call next', async () => {
            const validateStub = sinon.stub(byIdValidator, 'validateAsync').throws(new Error('Test Error'));

            const next: sinon.SinonSpy = sinon.spy();

            // Invoke the controller
            await findEventController({ body: {} } as Request, {} as Response, next);

            // Assert the expected behavior
            expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;

            // Restore the stub
            validateStub.restore();
        });

        it('should handle null result from EventModel.findById', async () => {
            // Mock byIdValidator.validateAsync to return a sample _id
            const sampleId = '1';
            const validateStub = sinon.stub(byIdValidator, 'validateAsync').resolves({ _id: sampleId });

            const findByIdStub = sinon.stub(EventModel, 'findById').resolves(null);
        
            const res: Partial<Response> = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
        
            // Invoke the controller
            await findEventController({ body: {} } as Request, res as Response, {} as NextFunction);
        
            expect((res.status as sinon.SinonStub).calledWith(500)).to.be.false;

            validateStub.restore();
            findByIdStub.restore();
        });
        
    });
});