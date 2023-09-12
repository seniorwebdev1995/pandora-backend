# Authentication workflow

## Specs

### Public endpoints

Achieved with a `@Public()` decorator, which sets endpoint metadata.

### Per-role protected endpoints

Achieved with a `@Roles(...)` decorator.
* Set metadata to the endpoint, in order to inform that this endpoint is protected.
* Set a `@RoleGuard`. At request time, it reads the required roles from the above metadata, and use the JWT token to compare with the requester's role.


### Per-role protected fields

We use `graphql-authz` lib to perform field-specific validation. It does not play perfectly well with how NestJS suggests to perform authentication. Therefore it brings a bit of complexity, and the workflow is a bit convoluted (hence this documentation).


### Endpoint auth monitor guard

This global guard is run by default on every endpoint. By reading the metadata, it ensures that every endpoint has explicit guard and is not overlooked. Every endpoint must be either explicitely public, or role-protected.
Calling an endpoint without any guard will result into a server error, since it is likely an oversight of the endpoint's implementer.


## Chronology of a request

1. GraphQL receives the request.

2. **GraphQL context creation**. In `graphql.module.ts`, we attempts to verify the JWT token if present. If the JWT is invalid, it writes the error into `req.jwtPayloadError`. If the JWT is valid, it writes the payload into `req.jwtPayload`. This function never throws or fails.

3. **AuthZ preExecRule** (if set). Pre-exec per-field validation kicks in. It can get the result of the JWT validation done just before, and validates the query before it is executed. It must throw if `req.jwtPayloadError` is set. AuthZ's `preExecRule`s are executed *before* any NestJS guard. Therefore we cannot rely on a guard to validate the JWT (as NestJS would suggest it in its doc).

4. **EndpointAuthMonitorGuard**. Global guard executed on every endpoint. Ensures that the endpoint is either explicitely public, or role-protected.

5. **RoleGuard** (if set). Read the JWT and compare the user's role with the endpoint's authorized roles. It throws if `req.jwtPayloadError` was set.

6. Endpoint code happens.

7. **AuthZ postExecRule** (if set). Post-exec per-field validation kicks in. It validates the query after it is executed, and therefore has access to the output payload.

8. Answer is sent to the client.
