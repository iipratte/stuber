-- Seed data for users table
INSERT INTO users (username, email) VALUES
    ('marcusrivera', 'marcus.rivera@byu.edu'),
    ('johndoe', 'john.doe@byu.edu'),
    ('janedoe', 'jane.doe@byu.edu'),
    ('bobsmith', 'bob.smith@byu.edu')
ON CONFLICT (username) DO NOTHING;
