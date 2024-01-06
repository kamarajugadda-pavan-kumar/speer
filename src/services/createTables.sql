-- users
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL, -- Use a strong hashing algorithm
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- notes
CREATE TABLE IF NOT EXISTS notes (
  note_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_shared BOOLEAN DEFAULT false
);

-- shared_notes
CREATE TABLE IF NOT EXISTS shared_notes (
  shared_note_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  note_id INT REFERENCES notes(note_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- keywords
CREATE TABLE IF NOT EXISTS keywords (
  keyword_id SERIAL PRIMARY KEY,
  note_id INT REFERENCES notes(note_id) ON DELETE CASCADE,
  keyword VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);