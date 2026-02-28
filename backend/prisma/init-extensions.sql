-- This script is executed once by postgres:16-alpine on first container start.
-- It installs all PostgreSQL extensions required by Porichoy before Prisma
-- runs its migrations.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
