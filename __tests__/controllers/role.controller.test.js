import request from 'supertest';
import express from 'express';
import roleRoutes from '../../routes/role.route.js';
import RoleService from '../../services/role.service.js';
import tokenService from '../../services/token.service.js';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import Role from '../../models/role.model.js';

jest.mock('../../services/role.service.js');
jest.mock('../../services/token.service.js');
jest.mock('../../models/role.model.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/api', roleRoutes);

describe('Role Controllers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        tokenService.verifyToken.mockImplementation(() => {});
        Role.findOne.mockResolvedValue(null);
    });

    it('should create a new role', async () => {
        const roleData = { name: 'Admin', permissions: ['read', 'write'] };
        RoleService.createRole.mockResolvedValue(roleData);

        const response = await request(app)
            .post('/api/createRole')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer dummyToken')
            .send(roleData);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.role).toEqual(roleData);
    });

    it('should get all roles', async () => {
        const roles = [
            { name: 'Admin', permissions: ['read', 'write'] },
            { name: 'User', permissions: ['read'] }
        ];
        RoleService.getRoles.mockResolvedValue(roles);

        const response = await request(app)
            .get('/api/getRoles')
            .set('Authorization', 'Bearer dummyToken');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.roles).toEqual(roles);
    });

    it('should get a single role', async () => {
        const role = { name: 'Admin', permissions: ['read', 'write'] };
        RoleService.getRole.mockResolvedValue(role);

        const id = '60d0fe4f5311236168a109ca';

        const response = await request(app)
            .get(`/api/getRole/${id}`)
            .set('Authorization', 'Bearer dummyToken');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.role).toEqual(role);
    });

    it('should update a role', async () => {
        const id = '60d0fe4f5311236168a109ca';
        const updatedRole = { name: 'Admin', permissions: ['read', 'write', 'delete'] };
        RoleService.updateRole.mockResolvedValue(updatedRole);

        const response = await request(app)
            .put(`/api/updateRole/${id}`)
            .set('Authorization', 'Bearer dummyToken')
            .send(updatedRole);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.role).toEqual(updatedRole);
    });
});