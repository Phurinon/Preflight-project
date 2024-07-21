#Get started
    -Make .env from .env.example
    -docker compose up -d

#User management
    -docker exec -it pf-db-g7 bash
        -psql -U postgres -d mydb

#Don't forget to change the password.
    REVOKE CONNECT ON DATABASE mydb FROM public;
    REVOKE ALL ON SCHEMA public FROM PUBLIC;
    CREATE USER appuser WITH PASSWORD '1234';
    CREATE SCHEMA drizzle;
    GRANT ALL ON DATABASE mydb TO appuser;
    GRANT ALL ON SCHEMA public TO appuser;
    GRANT ALL ON SCHEMA drizzle TO appuser;

#Setting up Drizzle
    npm init -y
    npm i drizzle-orm postgres dotenv
    npm i -D drizzle-kit
    npm i typescript ts-node tsconfig-paths
    npx drizzle-kit push
    npx drizzle-kit generate 
    npx ts-node ./db/migrate.ts 
    npx ts-node ./db/prototype.ts
