-- Complete database setup script
-- Run this file to set up the entire database

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed data for users table
INSERT INTO users (username, email) VALUES
    ('marcusrivera', 'marcus.rivera@byu.edu'),
    ('johndoe', 'john.doe@byu.edu'),
    ('janedoe', 'jane.doe@byu.edu'),
    ('bobsmith', 'bob.smith@byu.edu')
ON CONFLICT (username) DO NOTHING;
