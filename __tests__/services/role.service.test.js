import RoleService from '../../services/role.service.js';
import Role from '../../models/role.model.js';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { rolePrivileges } from "../../constants/role.constant.js";

jest.mock('../../models/role.model.js');

describe('RoleService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new role', async () => {
        const roleData = {
            name: 'admin',
            permissions: [rolePrivileges.role.read, rolePrivileges.role]
        };
        Role.create.mockResolvedValue(roleData);

        const newRole = await RoleService.createRole(roleData.name, roleData.permissions);

        expect(Role.create).toHaveBeenCalledWith(roleData);
        expect(newRole).toEqual(roleData);
    });

    it('should get all roles with pagination and filtering', async () => {
        const roles = [
            { name: 'Admin', permissions: [rolePrivileges.role.read, rolePrivileges.role.update], status: 'active' },
            { name: 'User', permissions: [rolePrivileges.role.read], status: 'inactive' }
        ];
        const filteredRoles = [roles[0]];

        Role.find.mockReturnValue({
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue(filteredRoles)
        });

        const filters = {
            name: {
                $regex: new RegExp('Admin', 'i')
            },
            status: 'active'
        };
        const page = 1;
        const page_size = 10;

        const result = await RoleService.getRoles(filters, page, page_size);

        expect(Role.find).toHaveBeenCalledWith(filters);
        expect(Role.find().skip).toHaveBeenCalledWith((page - 1) * page_size);
        expect(Role.find().limit).toHaveBeenCalledWith(page_size);
        expect(result).toEqual(filteredRoles);
    });

    it('should get a single role', async () => {
        const role = {
            name: 'Admin',
            permissions: [rolePrivileges.role.update, rolePrivileges.role.create]
        };
        Role.findById.mockResolvedValue(role);

        const result = await RoleService.getRole('roleId');

        expect(Role.findById).toHaveBeenCalledWith('roleId');
        expect(result).toEqual(role);
    });

    it('should update a role', async () => {
        const updatedRole = {
            name: 'Admin',
            permissions: [rolePrivileges.role.read, rolePrivileges.role.update, rolePrivileges.role.create]
        };
        Role.findByIdAndUpdate.mockResolvedValue(updatedRole);

        const result = await RoleService.updateRole('roleId', updatedRole.name, updatedRole.permissions);

        expect(Role.findByIdAndUpdate).toHaveBeenCalledWith('roleId', { name: updatedRole.name, permissions: updatedRole.permissions }, { new: true });
        expect(result).toEqual(updatedRole);
    });
});