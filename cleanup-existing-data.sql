-- Handle existing data with NULL user_id values
-- Run AFTER setup-cascade-deletes-fixed.sql

-- ==================================================
-- OPTION 1: DELETE ALL EXISTING DATA (SAFEST)
-- ==================================================
-- This is the cleanest approach since the data won't have proper user associations

-- Delete all existing records (they'll be recreated when users play games)
DELETE FROM coin_game WHERE user_id IS NULL;
DELETE FROM dice_game WHERE user_id IS NULL;
DELETE FROM crra_calibration WHERE user_id IS NULL;

-- Optional: Also clean up profiles table if needed
-- DELETE FROM profiles WHERE id NOT IN (SELECT id FROM auth.users);

-- ==================================================
-- OPTION 2: ASSIGN TO A TEST USER (IF YOU WANT TO KEEP DATA)
-- ==================================================
-- Only use this if you have test data you want to preserve
-- First, you'd need to create a test user in Supabase Auth, then:

-- Replace 'YOUR_TEST_USER_ID' with actual user UUID from auth.users
-- UPDATE coin_game SET user_id = 'YOUR_TEST_USER_ID' WHERE user_id IS NULL;
-- UPDATE dice_game SET user_id = 'YOUR_TEST_USER_ID' WHERE user_id IS NULL;
-- UPDATE crra_calibration SET user_id = 'YOUR_TEST_USER_ID' WHERE user_id IS NULL;

-- ==================================================
-- VERIFY THE CLEANUP
-- ==================================================

-- Check that no NULL user_ids remain
SELECT 'coin_game' as table_name, COUNT(*) as null_user_ids 
FROM coin_game WHERE user_id IS NULL
UNION ALL
SELECT 'dice_game' as table_name, COUNT(*) as null_user_ids 
FROM dice_game WHERE user_id IS NULL  
UNION ALL
SELECT 'crra_calibration' as table_name, COUNT(*) as null_user_ids 
FROM crra_calibration WHERE user_id IS NULL;