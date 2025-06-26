-- Seed initial data for Infinity Tech Society

-- Insert default achievements
INSERT INTO achievements (title, description, icon, category, difficulty, points, requirements, rarity) VALUES
('First Steps', 'Welcome to Infinity Tech Society! Complete your profile setup.', '🚀', 'onboarding', 'beginner', 50, ARRAY['Complete profile', 'Add bio', 'Upload avatar'], 'common'),
('Team Player', 'Join your first project team and start collaborating.', '🤝', 'collaboration', 'beginner', 100, ARRAY['Join a project', 'Send first message'], 'common'),
('Code Warrior', 'Submit your first assignment and show your coding skills.', '💻', 'academic', 'beginner', 150, ARRAY['Submit assignment', 'Get passing grade'], 'common'),
('Research Pioneer', 'Contribute to your first research paper or publication.', '📚', 'research', 'intermediate', 300, ARRAY['Co-author paper', 'Get published'], 'uncommon'),
('Innovation Master', 'Lead a breakthrough project that gets featured.', '💡', 'innovation', 'advanced', 500, ARRAY['Lead featured project', 'Get 100+ likes'], 'rare'),
('Community Leader', 'Help and mentor other students in the community.', '👑', 'leadership', 'advanced', 400, ARRAY['Help 10 students', 'Get positive feedback'], 'rare'),
('AI Specialist', 'Complete 5 AI/ML projects and become a domain expert.', '🧠', 'specialization', 'advanced', 600, ARRAY['Complete 5 AI projects', 'Maintain 90% grade'], 'epic'),
('Collaboration Expert', 'Work with teams across 3 different domains.', '🌐', 'collaboration', 'intermediate', 250, ARRAY['Work in 3 domains', 'Complete team projects'], 'uncommon');

-- Insert default chat channels
INSERT INTO chat_channels (name, description, type, is_private) VALUES
('general', 'General discussions and announcements', 'public', false),
('project-team', 'Project collaboration and updates', 'public', false),
('ai-research', 'AI and Machine Learning discussions', 'public', false),
('code-review', 'Code reviews and technical discussions', 'public', false),
('study-group', 'Study sessions and academic help', 'public', false),
('announcements', 'Official announcements from faculty', 'public', false);

-- Insert system settings
INSERT INTO system_settings (key, value, description) VALUES
('platform_name', '"Infinity Tech Society"', 'Name of the platform'),
('max_team_size', '5', 'Maximum team size for projects'),
('assignment_late_penalty', '10', 'Percentage penalty for late submissions'),
('achievement_multiplier', '1.0', 'Point multiplier for achievements'),
('notification_enabled', 'true', 'Enable system notifications'),
('maintenance_mode', 'false', 'Platform maintenance mode');

-- Insert sample assignments (created by system)
INSERT INTO assignments (title, description, subject, due_date, priority, total_points, difficulty, estimated_time, requirements, created_by) 
SELECT 
    'Getting Started with AI',
    'Introduction to Artificial Intelligence concepts and basic implementation. Create a simple machine learning model using Python and scikit-learn.',
    'Artificial Intelligence',
    CURRENT_DATE + INTERVAL '14 days',
    'high',
    100,
    'beginner',
    '6-8 hours',
    ARRAY['Python basics', 'Install required libraries', 'Submit Jupyter notebook'],
    id
FROM users WHERE role = 'admin' LIMIT 1;

INSERT INTO assignments (title, description, subject, due_date, priority, total_points, difficulty, estimated_time, requirements, created_by) 
SELECT 
    'Data Structures Implementation',
    'Implement and analyze common data structures including arrays, linked lists, stacks, and queues. Compare their time and space complexity.',
    'Computer Science',
    CURRENT_DATE + INTERVAL '21 days',
    'medium',
    150,
    'intermediate',
    '10-12 hours',
    ARRAY['Implement 4 data structures', 'Write complexity analysis', 'Include test cases'],
    id
FROM users WHERE role = 'admin' LIMIT 1;

INSERT INTO assignments (title, description, subject, due_date, priority, total_points, difficulty, estimated_time, requirements, created_by) 
SELECT 
    'Research Paper Review',
    'Select and critically analyze a recent research paper in your domain of interest. Provide detailed insights and potential improvements.',
    'Research Methods',
    CURRENT_DATE + INTERVAL '28 days',
    'medium',
    120,
    'advanced',
    '8-10 hours',
    ARRAY['Select recent paper', 'Write 2000-word review', 'Suggest improvements'],
    id
FROM users WHERE role = 'admin' LIMIT 1;
