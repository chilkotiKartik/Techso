-- Create database schema for Infinity Tech Society

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    bio TEXT,
    department VARCHAR(100),
    year_of_study INTEGER,
    skills TEXT[],
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'active',
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    domain VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    progress INTEGER DEFAULT 0,
    github_url VARCHAR(255),
    demo_url VARCHAR(255),
    documentation_url VARCHAR(255),
    tech_stack TEXT[],
    tags TEXT[],
    difficulty_level VARCHAR(20) DEFAULT 'intermediate',
    estimated_duration VARCHAR(50),
    max_team_size INTEGER DEFAULT 5,
    is_featured BOOLEAN DEFAULT FALSE,
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    downloads_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project team members
CREATE TABLE IF NOT EXISTS project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    due_date DATE NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium',
    total_points INTEGER DEFAULT 100,
    difficulty VARCHAR(20) DEFAULT 'intermediate',
    estimated_time VARCHAR(50),
    requirements TEXT[],
    attachments TEXT[],
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assignment submissions
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachments TEXT[],
    progress INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    earned_points INTEGER,
    feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    graded_at TIMESTAMP WITH TIME ZONE,
    graded_by UUID REFERENCES users(id),
    UNIQUE(assignment_id, student_id)
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(10) NOT NULL,
    category VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    points INTEGER NOT NULL,
    requirements TEXT[],
    rarity VARCHAR(20) DEFAULT 'common',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    max_progress INTEGER DEFAULT 100,
    earned BOOLEAN DEFAULT FALSE,
    earned_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, achievement_id)
);

-- Chat channels
CREATE TABLE IF NOT EXISTS chat_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(20) DEFAULT 'public',
    is_private BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID REFERENCES chat_channels(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text',
    reactions JSONB DEFAULT '{}',
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP WITH TIME ZONE,
    reply_to UUID REFERENCES chat_messages(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'info',
    priority VARCHAR(20) DEFAULT 'medium',
    audience VARCHAR(20) DEFAULT 'all',
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Research papers
CREATE TABLE IF NOT EXISTS research_papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    abstract TEXT NOT NULL,
    authors UUID[] NOT NULL,
    domain VARCHAR(100) NOT NULL,
    keywords TEXT[],
    status VARCHAR(20) DEFAULT 'draft',
    publication_date DATE,
    journal VARCHAR(255),
    doi VARCHAR(255),
    pdf_url VARCHAR(255),
    citations_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity logs
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System settings
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_projects_domain ON projects(domain);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_assignments_subject ON assignments(subject);
CREATE INDEX IF NOT EXISTS idx_chat_messages_channel_id ON chat_messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_announcements_audience ON announcements(audience);
CREATE INDEX IF NOT EXISTS idx_announcements_is_active ON announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_research_papers_updated_at BEFORE UPDATE ON research_papers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
