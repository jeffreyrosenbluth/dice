-- Setup CASCADE DELETE constraints - CORRECTED VERSION
-- The game tables only have 'id' columns, need to add 'user_id' columns first

-- ==================================================
-- STEP 1: ADD MISSING user_id COLUMNS
-- ==================================================

-- Add user_id column to coin_game table
ALTER TABLE coin_game ADD COLUMN IF NOT EXISTS user_id UUID;

-- Add user_id column to dice_game table  
ALTER TABLE dice_game ADD COLUMN IF NOT EXISTS user_id UUID;

-- Add user_id column to crra_calibration table
ALTER TABLE crra_calibration ADD COLUMN IF NOT EXISTS user_id UUID;

-- ==================================================
-- STEP 2: SETUP FOREIGN KEY CONSTRAINTS WITH CASCADE
-- ==================================================

-- 1. PROFILES table - reference auth.users with CASCADE
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. COIN_GAME table - reference auth.users with CASCADE
ALTER TABLE coin_game DROP CONSTRAINT IF EXISTS coin_game_user_id_fkey;
ALTER TABLE coin_game 
ADD CONSTRAINT coin_game_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. DICE_GAME table - reference auth.users with CASCADE
ALTER TABLE dice_game DROP CONSTRAINT IF EXISTS dice_game_user_id_fkey;
ALTER TABLE dice_game 
ADD CONSTRAINT dice_game_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. CRRA_CALIBRATION table - reference auth.users with CASCADE  
ALTER TABLE crra_calibration DROP CONSTRAINT IF EXISTS crra_calibration_user_id_fkey;
ALTER TABLE crra_calibration 
ADD CONSTRAINT crra_calibration_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ==================================================
-- STEP 3: UPDATE ROW LEVEL SECURITY (RLS) POLICIES
-- ==================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_game ENABLE ROW LEVEL SECURITY;
ALTER TABLE dice_game ENABLE ROW LEVEL SECURITY;
ALTER TABLE crra_calibration ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view own coin game data" ON coin_game;
DROP POLICY IF EXISTS "Users can insert own coin game data" ON coin_game;
DROP POLICY IF EXISTS "Users can update own coin game data" ON coin_game;

DROP POLICY IF EXISTS "Users can view own dice game data" ON dice_game;
DROP POLICY IF EXISTS "Users can insert own dice game data" ON dice_game;
DROP POLICY IF EXISTS "Users can update own dice game data" ON dice_game;

DROP POLICY IF EXISTS "Users can view own calibration data" ON crra_calibration;
DROP POLICY IF EXISTS "Users can insert own calibration data" ON crra_calibration;
DROP POLICY IF EXISTS "Users can update own calibration data" ON crra_calibration;

-- Create RLS policies for PROFILES
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for COIN_GAME
CREATE POLICY "Users can view own coin game data" ON coin_game
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coin game data" ON coin_game
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own coin game data" ON coin_game
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for DICE_GAME
CREATE POLICY "Users can view own dice game data" ON dice_game
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dice game data" ON dice_game
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dice game data" ON dice_game
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for CRRA_CALIBRATION
CREATE POLICY "Users can view own calibration data" ON crra_calibration
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calibration data" ON crra_calibration
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calibration data" ON crra_calibration
    FOR UPDATE USING (auth.uid() = user_id);

-- ==================================================
-- STEP 4: VERIFY THE SETUP
-- ==================================================

-- Check that constraints were created properly
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
    LEFT JOIN information_schema.referential_constraints AS rc
      ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public'
AND tc.table_name IN ('profiles', 'coin_game', 'dice_game', 'crra_calibration')
ORDER BY tc.table_name;