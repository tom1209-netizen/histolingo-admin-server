import request from 'supertest';
import express from "express";
import roleRoute from "../../routes/role.route.js";
import roleService from "../../services/role.service.js";
import { rolePrivileges } from "../../constants/role.constant.js";
import tokenService from "../../services/token.service.js";
import Role from "../../models/role.model.js";
import { describe, beforeEach, it, expect, jest } from "@jest/globals";

jest.mock('../../services/role.service.js');
jest.mock('../../services/token.service.js');
jest.mock('../../models/role.model.js');
jest.mock('../../middlewares/auth.middleware.js', () => ({
    authentication: jest.fn((req, res, next) => next()),
    authorization: jest.fn(() => (req, res, next) => next())
}));

const app = express();
app.use(express.json());
app.use('/roles', roleRoute);

describe('Role Controllers', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        tokenService.verifyToken.mockImplementation(() => {});
        Role.findById.mockResolvedValue(null);
    });

    it('should create a new role', async () => {
        const roleData = { name: 'Admin', permissions: [rolePrivileges.role.create] };
        roleService.createRole.mockResolvedValue(roleData);

        const response = await request(app)
            .post('/roles')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer dummyToken')
            .send(roleData);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.role).toEqual(roleData);
    });

    it('should handle create role error', async () => {
        roleService.createRole.mockRejectedValue(new Error('Error creating role'));

        const response = await request(app)
            .post('/roles')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer dummyToken')
            .send({ name: 'Admin', permissions: [rolePrivileges.role.create] });

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Error creating role');
    });

    it('should get all roles with pagination, filtering by name and status', async () => {
        const roles = [
            { name: 'Admin', permissions: [rolePrivileges.role.read, rolePrivileges.role.create], status: 'active' },
            { name: 'User', permissions: [rolePrivileges.role.read], status: 'inactive' }
        ];
        const filteredRoles = [roles[0]]; // Assuming a filtered response
        roleService.getRoles.mockResolvedValue(filteredRoles);

        const response = await request(app)
            .get('/roles?page=1&page_size=10&name=Admin&status=active')
            .set('Authorization', 'Bearer dummyToken');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.roles).toEqual(filteredRoles);
    });

    it('should handle get roles error', async () => {
        roleService.getRoles.mockRejectedValue(new Error('Error getting roles'));

        const response = await request(app)
            .get('/roles')
            .set('Authorization', 'Bearer dummyToken');

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Error getting roles');
    });

    it('should get a single role', async () => {
        const role = {
            name: 'Admin',
            permissions: [rolePrivileges.role.read, rolePrivileges.role.create]
        };
        roleService.getRole.mockResolvedValue(role);

        const id = '60d0fe4f5311236168a109ca';

        const response = await request(app)
            .get(`/roles/${id}`)
            .set('Authorization', 'Bearer dummyToken');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.role).toEqual(role);
    });

    it('should handle get single role error', async () => {
        roleService.getRole.mockRejectedValue(new Error('Error getting role'));

        const id = '60d0fe4f5311236168a109ca';

        const response = await request(app)
            .get(`/roles/${id}`)
            .set('Authorization', 'Bearer dummyToken');

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Error getting role');
    });

    it('should return 404 if role not found', async () => {
        roleService.getRole.mockResolvedValue(null);

        const id = '60d0fe4f5311236168a109ca';

        const response = await request(app)
            .get(`/roles/${id}`)
            .set('Authorization', 'Bearer dummyToken');

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Role not found');
    });

    it('should update a role', async () => {
        const id = '60d0fe4f5311236168a109ca';
        const updatedRole = {
            name: 'Admin',
            permissions: [rolePrivileges.role.read, rolePrivileges.role.create, rolePrivileges.role.delete]
        };
        roleService.updateRole.mockResolvedValue(updatedRole);

        const response = await request(app)
            .put(`/roles/${id}`)
            .set('Authorization', 'Bearer dummyToken')
            .send(updatedRole);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.role).toEqual(updatedRole);
    });

    it('should handle update role error', async () => {
        roleService.updateRole.mockRejectedValue(new Error('Error updating role'));

        const id = '60d0fe4f5311236168a109ca';
        const updatedRole = {
            name: 'Admin',
            permissions: [rolePrivileges.role.read, rolePrivileges.role.create, rolePrivileges.role.delete]
        };

        const response = await request(app)
            .put(`/roles/${id}`)
            .set('Authorization', 'Bearer dummyToken')
            .send(updatedRole);

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Error updating role');
    });

    it('should return 404 if updating non-existent role', async () => {
        roleService.updateRole.mockResolvedValue(null);

        const id = '60d0fe4f5311236168a109ca';
        const updatedRole = {
            name: 'Admin',
            permissions: [rolePrivileges.role.read, rolePrivileges.role.create, rolePrivileges.role.delete]
        };

        const response = await request(app)
            .put(`/roles/${id}`)
            .set('Authorization', 'Bearer dummyToken')
            .send(updatedRole);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Role not found');
    });
});
