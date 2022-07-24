import { SetMetadata } from '@nestjs/common';

import { UserRole } from '../users/models/user.model';

export type AllowedRoles = keyof typeof UserRole | 'Any';

export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
