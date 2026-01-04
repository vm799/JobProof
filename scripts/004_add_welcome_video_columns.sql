-- Add welcome video URL to workspaces (set by company)
ALTER TABLE workspaces 
ADD COLUMN IF NOT EXISTS welcome_video_url TEXT;

-- Add tracking for users who have seen the welcome video
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS has_seen_welcome_video BOOLEAN DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN workspaces.welcome_video_url IS 'Loom or YouTube URL for welcome video shown on first login';
COMMENT ON COLUMN profiles.has_seen_welcome_video IS 'Tracks if user has seen the welcome video to prevent repetition';
