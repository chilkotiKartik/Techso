-- Drop existing tables if they exist
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS assignment_submissions CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_channels CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    bio TEXT,
    department VARCHAR(100),
    year_of_study INTEGER,
    skills TEXT[],
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create announcements table
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general',
    priority VARCHAR(20) DEFAULT 'medium',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    category VARCHAR(100),
    difficulty VARCHAR(20) DEFAULT 'intermediate',
    tech_stack TEXT[],
    github_url TEXT,
    demo_url TEXT,
    image_url TEXT,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project members table
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Create chat channels table
CREATE TABLE chat_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'general',
    description TEXT,
    is_private BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat messages table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID REFERENCES chat_channels(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text',
    attachments TEXT[],
    reply_to UUID REFERENCES chat_messages(id) ON DELETE SET NULL,
    is_edited BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignments table
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium',
    total_points INTEGER DEFAULT 100,
    difficulty VARCHAR(20) DEFAULT 'intermediate',
    estimated_time VARCHAR(50),
    requirements TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignment submissions table
CREATE TABLE assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachments TEXT[],
    progress INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    earned_points INTEGER,
    feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    graded_at TIMESTAMP WITH TIME ZONE,
    graded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(assignment_id, student_id)
);

-- Create achievements table
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(10) DEFAULT '🏆',
    category VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'intermediate',
    points INTEGER DEFAULT 10,
    requirements TEXT[],
    rarity VARCHAR(20) DEFAULT 'common',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user achievements table
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    max_progress INTEGER DEFAULT 100,
    earned BOOLEAN DEFAULT false,
    earned_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, achievement_id)
);

-- Create activity logs table
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_announcements_active ON announcements(is_active);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_chat_messages_channel ON chat_messages(channel_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_assignment_submissions_student ON assignment_submissions(student_id);
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Everyone can view active announcements" ON announcements FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage announcements" ON announcements FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Everyone can view active projects" ON projects FOR SELECT USING (status = 'active');
CREATE POLICY "Users can create projects" ON projects FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Project creators can update their projects" ON projects FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can view chat messages" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Users can send messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can view assignments" ON assignments FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('student', 'admin'))
);
CREATE POLICY "Admins can manage assignments" ON assignments FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Students can view own submissions" ON assignment_submissions FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can create submissions" ON assignment_submissions FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update own submissions" ON assignment_submissions FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Admins can view all submissions" ON assignment_submissions FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage achievements" ON user_achievements FOR ALL USING (true);

CREATE POLICY "Users can view own activity" ON activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can log activity" ON activity_logs FOR INSERT WITH CHECK (true);
