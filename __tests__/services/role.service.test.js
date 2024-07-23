import RoleService from '../../services/role.service.js';
import Role from '../../models/role.model.js';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';

jest.mock('../../models/role.model.js');

describe('RoleService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new role', async () => {
        const roleData = { name: 'admin', permissions: ['read', 'write'] };
        Role.create.mockResolvedValue(roleData);

        const newRole = await RoleService.createRole(roleData.name, roleData.permissions);

        expect(Role.create).toHaveBeenCalledWith(roleData);
        expect(newRole).toEqual(roleData);
    });

    it('should get all roles', async () => {
        const roles = [
            { name: 'Admin', permissions: ['read', 'write'] },
            { name: 'User', permissions: ['read'] }
        ];
        Role.find.mockResolvedValue(roles);

        const result = await RoleService.getRoles();

        expect(Role.find).toHaveBeenCalled();
        expect(result).toEqual(roles);
    });

    it('should update a role', async () => {
        const updatedRole = { name: 'Admin', permissions: ['read', 'write', 'delete'] };
        Role.findByIdAndUpdate.mockResolvedValue(updatedRole);

        const result = await RoleService.updateRole('roleId', updatedRole.name, updatedRole.permissions);

        expect(Role.findByIdAndUpdate).toHaveBeenCalledWith('roleId', { name: updatedRole.name, permissions: updatedRole.permissions }, { new: true });
        expect(result).toEqual(updatedRole);
    });
});