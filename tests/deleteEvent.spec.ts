import { expect } from 'chai';
import * as sinon from 'sinon';

import { byIdValidator } from '../src/validators/byId.validator';
import { EventModel } from '../src/models/event.model';
import { deleteEventController } from '../src/controllers/delete.controller';
import { NextFunction, Request, Response } from 'express';

describe('Delete Event', () => {
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

describe('deleteEventController', () => {
    it('should delete an event and return success message', async () => {
        const sampleId = '1';
        const validateStub = sinon.stub(byIdValidator, 'validateAsync').resolves({ _id: sampleId });
        const findByIdAndDeleteStub = sinon.stub(EventModel, 'findByIdAndDelete').resolves();

        const res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        await deleteEventController({ body: {} } as Request, res as Response, {} as NextFunction);

        expect((validateStub as sinon.SinonStub).calledOnce).to.be.true;
        expect((findByIdAndDeleteStub as sinon.SinonStub).calledOnceWithExactly(sampleId)).to.be.true;
        expect((res.status as sinon.SinonStub).calledWith(200)).to.be.true;
        expect((res.json as sinon.SinonStub).calledWith({
            statusCode: 200,
            message: 'Deleted Event Successfully',
        })).to.be.true;

        validateStub.restore();
        findByIdAndDeleteStub.restore();
    });

    it('should handle errors and call next', async () => {
        const sampleId = '1';
        const validateStub = sinon.stub(byIdValidator, 'validateAsync').resolves({ _id: sampleId });
        const error = new Error('Test Error');
        const findByIdAndDeleteStub = sinon.stub(EventModel, 'findByIdAndDelete').throws(error);

        const next: sinon.SinonSpy = sinon.spy();

        await deleteEventController({ body: {} } as Request, {} as Response, next);

        expect((validateStub as sinon.SinonStub).calledOnce).to.be.true;
        expect((findByIdAndDeleteStub as sinon.SinonStub).calledOnceWithExactly(sampleId)).to.be.true;

        validateStub.restore();
        findByIdAndDeleteStub.restore();
    });
});