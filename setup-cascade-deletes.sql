-- Setup CASCADE DELETE constraints for proper user data cleanup
-- Run this SQL in your Supabase SQL Editor

-- First, let's see the current table structures
-- (You can run this section first to understand current state)

-- Check current constraints
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- ==================================================
-- SETUP PROPER FOREIGN KEY CONSTRAINTS WITH CASCADE
-- ==================================================

-- Drop existing foreign key constraints (if any) and recreate with CASCADE

-- 1. PROFILES table - should reference auth.users with CASCADE
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. COIN_GAME table - should reference auth.users with CASCADE
-- First check if user_id column exists, if not we'll need to see the actual schema
DO $$
BEGIN
    -- Try to drop existing constraint (if exists)
    BEGIN
        ALTER TABLE coin_game DROP CONSTRAINT IF EXISTS coin_game_user_id_fkey;
    EXCEPTION
        WHEN undefined_column THEN
            -- user_id column doesn't exist, we need to add it
            ALTER TABLE coin_game ADD COLUMN user_id UUID;
    END;
    
    -- Add the constraint with CASCADE
    ALTER TABLE coin_game 
    ADD CONSTRAINT coin_game_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
END $$;

-- 3. DICE_GAME table - should reference auth.users with CASCADE
DO $$
BEGIN
    -- Try to drop existing constraint (if exists)
    BEGIN
        ALTER TABLE dice_game DROP CONSTRAINT IF EXISTS dice_game_user_id_fkey;
    EXCEPTION
        WHEN undefined_column THEN
            -- user_id column doesn't exist, we need to add it
            ALTER TABLE dice_game ADD COLUMN user_id UUID;
    END;
    
    -- Add the constraint with CASCADE
    ALTER TABLE dice_game 
    ADD CONSTRAINT dice_game_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
END $$;

-- 4. CRRA_CALIBRATION table - should reference auth.users with CASCADE  
DO $$
BEGIN
    -- Try to drop existing constraint (if exists)
    BEGIN
        ALTER TABLE crra_calibration DROP CONSTRAINT IF EXISTS crra_calibration_user_id_fkey;
    EXCEPTION
        WHEN undefined_column THEN
            -- user_id column doesn't exist, we need to add it
            ALTER TABLE crra_calibration ADD COLUMN user_id UUID;
    END;
    
    -- Add the constraint with CASCADE
    ALTER TABLE crra_calibration 
    ADD CONSTRAINT crra_calibration_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
END $$;

-- ==================================================
-- UPDATE ROW LEVEL SECURITY (RLS) POLICIES
-- ==================================================

-- Enable RLS on all tables if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_game ENABLE ROW LEVEL SECURITY;
ALTER TABLE dice_game ENABLE ROW LEVEL SECURITY;
ALTER TABLE crra_calibration ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
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

-- Create new RLS policies for PROFILES
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create new RLS policies for COIN_GAME
CREATE POLICY "Users can view own coin game data" ON coin_game
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coin game data" ON coin_game
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own coin game data" ON coin_game
    FOR UPDATE USING (auth.uid() = user_id);

-- Create new RLS policies for DICE_GAME
CREATE POLICY "Users can view own dice game data" ON dice_game
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dice game data" ON dice_game
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dice game data" ON dice_game
    FOR UPDATE USING (auth.uid() = user_id);

-- Create new RLS policies for CRRA_CALIBRATION
CREATE POLICY "Users can view own calibration data" ON crra_calibration
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calibration data" ON crra_calibration
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calibration data" ON crra_calibration
    FOR UPDATE USING (auth.uid() = user_id);

-- ==================================================
-- VERIFY THE SETUP
-- ==================================================

-- Check that constraints were created properly
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    LEFT JOIN information_schema.referential_constraints AS rc
      ON tc.constraint_name = rc.constraint_name
      AND tc.table_schema = rc.constraint_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public'
AND tc.table_name IN ('profiles', 'coin_game', 'dice_game', 'crra_calibration')
ORDER BY tc.table_name;