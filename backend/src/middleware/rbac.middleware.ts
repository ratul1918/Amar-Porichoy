import { Request, Response, NextFunction } from 'express';
import { AppError } from '@utils/errors';
import { ErrorCode, PERMISSIONS, ROLE_HIERARCHY, RoleName } from '@app-types/index';

// ─────────────────────────────────────────────
// RBAC Guard — check roles and/or permissions
// ─────────────────────────────────────────────

/**
 * Require the authenticated user to have at least one of the specified roles.
 * The role hierarchy is respected: a SUPER_ADMIN passes all role checks.
 */
export function requireRole(...allowedRoles: RoleName[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError(ErrorCode.UNAUTHORIZED, 'Authentication required', 401);
    }

    const userRoles = req.user.roles;

    // SUPER_ADMIN bypasses all role checks
    if (userRoles.includes('SUPER_ADMIN')) {
      return next();
    }

    const hasRole = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      throw new AppError(
        ErrorCode.FORBIDDEN,
        `Access denied. Required role: ${allowedRoles.join(' or ')}`,
        403
      );
    }

    next();
  };
}

/**
 * Require the authenticated user to have the specified permission string.
 * Permissions can be: 'applications:approve', 'users:manage', etc.
 * SUPER_ADMIN has the wildcard '*' permission that passes everything.
 */
export function requirePermission(...requiredPermissions: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError(ErrorCode.UNAUTHORIZED, 'Authentication required', 401);
    }

    const userPermissions = req.user.permissions;

    // Wildcard
    if (userPermissions.includes('*')) {
      return next();
    }

    const hasAll = requiredPermissions.every((p) => userPermissions.includes(p));

    if (!hasAll) {
      throw new AppError(
        ErrorCode.FORBIDDEN,
        `Insufficient permissions. Required: ${requiredPermissions.join(', ')}`,
        403
      );
    }

    next();
  };
}

/**
 * Check that the requesting user can act on behalf of the target user ID.
 * Citizens can only access their own resources unless they're staff.
 */
export function requireOwnerOrRole(ownerId: (req: Request) => string, ...staffRoles: RoleName[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError(ErrorCode.UNAUTHORIZED, 'Authentication required', 401);
    }

    const userRoles = req.user.roles;

    if (userRoles.includes('SUPER_ADMIN')) return next();

    const isStaff = staffRoles.some((r) => userRoles.includes(r));
    if (isStaff) return next();

    const targetId = ownerId(req);
    if (req.user.sub === targetId) return next();

    throw new AppError(ErrorCode.FORBIDDEN, 'You do not have access to this resource', 403);
  };
}

// ─────────────────────────────────────────────
// Build permission list from roles
// ─────────────────────────────────────────────

export function buildPermissionsForRoles(roles: RoleName[]): string[] {
  const permSet = new Set<string>();

  // Sort roles by hierarchy, process from lowest to highest
  const sorted = roles.sort(
    (a, b) => ROLE_HIERARCHY.indexOf(a) - ROLE_HIERARCHY.indexOf(b)
  );

  for (const role of sorted) {
    const perms = PERMISSIONS[role] ?? [];
    for (const p of perms) {
      permSet.add(p);
    }
  }

  // SUPER_ADMIN: collapse to wildcard
  if (permSet.has('*')) return ['*'];

  return Array.from(permSet);
}

/**
 * Checks whether a role at `candidateIndex` in the hierarchy satisfies
 * the minimum role requirement.
 */
export function hasMinimumRole(userRoles: RoleName[], minimumRole: RoleName): boolean {
  const minIndex = ROLE_HIERARCHY.indexOf(minimumRole);
  return userRoles.some((r) => ROLE_HIERARCHY.indexOf(r) >= minIndex);
}
