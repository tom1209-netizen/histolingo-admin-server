import { authentication, authorization } from '../../middlewares/auth.middleware.js';
import tokenService from '../../services/token.service.js';
import Role from '../../models/role.model.js';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';

jest.mock('../../services/token.service.js');
jest.mock('../../models/role.model.js');

describe('Authentication Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should return 403 if no token is provided', async () => {
        await authentication(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: "No token provided",
            status: 403,
            error: "Unauthorized"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if the token is invalid', async () => {
        req.headers.authorization = 'Bearer invalidtoken';
        tokenService.verifyToken.mockImplementation(() => {
            throw new Error('Invalid token');
        });

        await authentication(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: "Invalid token",
            status: 403,
            error: "Unauthorized",
            details: 'Invalid token'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next if the token is valid', async () => {
        req.headers.authorization = 'Bearer validtoken';
        tokenService.verifyToken.mockReturnValue({ userId: 'someUserId' });

        await authentication(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});

describe('Authorization Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            admin: {
                roleId: 'someRoleId'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should return 403 if no admin data is provided', async () => {
        req.admin = null;

        const middleware = authorization(1);
        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: "No admin data provided",
            status: 403,
            error: "Forbidden"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if the role is not found', async () => {
        Role.findById.mockResolvedValue(null);

        const middleware = authorization(1);
        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: "Role not found",
            status: 403,
            error: "Forbidden"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if the permission is denied', async () => {
        Role.findById.mockResolvedValue({
            permissions: [2, 3]
        });

        const middleware = authorization(1);
        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: "Permission denied",
            status: 403,
            error: "Forbidden"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next if the permission is granted', async () => {
        Role.findById.mockResolvedValue({
            permissions: [1, 2, 3]
        });

        const middleware = authorization(1);
        await middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 403 if an error occurs during authorization', async () => {
        Role.findById.mockImplementation(() => {
            throw new Error('Some error');
        });

        const middleware = authorization(1);
        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: "An error occurred during authorization",
            status: 403,
            error: "Forbidden",
            details: 'Some error'
        });
        expect(next).not.toHaveBeenCalled();
    });
});