# Supabase Reinstatement Plan

## Current Status
- Supabase instance has lapsed: `https://tqpftnrwyvluseznufdy.supabase.co`
- Codebase is configured for Supabase integration
- App currently uses override mode (`OVERRIDE: boolean = true`)

## Dependencies Analysis
- **@supabase/supabase-js**: v2.44.3 (main client)
- **@supabase/ssr**: v0.4.0 (SSR support)
- Next.js 14.2.4 with App Router

## Database Schema Requirements

Based on code analysis, the following tables need to be recreated:

### `profiles` table
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  coin_complete BOOLEAN DEFAULT FALSE,
  dice_complete BOOLEAN DEFAULT FALSE,
  calibration_complete BOOLEAN DEFAULT FALSE
);
```

### `config` table
```sql
CREATE TABLE config (
  id SERIAL PRIMARY KEY,
  coin_game_enabled BOOLEAN DEFAULT TRUE,
  coin_game_min_flips INTEGER DEFAULT 10,
  coin_game_max_flips INTEGER DEFAULT 100,
  coin_game_bias DECIMAL DEFAULT 0.5,
  coin_game_minutes INTEGER DEFAULT 10,
  coin_sim_enabled BOOLEAN DEFAULT TRUE,
  coin_sim_max_samples INTEGER DEFAULT 1000,
  coin_sim_max_flips INTEGER DEFAULT 1000,
  dice_game_enabled BOOLEAN DEFAULT TRUE,
  dice_game_rolls INTEGER DEFAULT 20,
  dice_sim_enabled BOOLEAN DEFAULT TRUE,
  dice_sim_max_samples INTEGER DEFAULT 1000
);
```

### `coin_game` table
```sql
CREATE TABLE coin_game (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  -- Add specific columns based on game data structure
  created_at TIMESTAMP DEFAULT NOW()
);
```

### `dice_game` table
```sql
CREATE TABLE dice_game (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  -- Add specific columns based on game data structure
  created_at TIMESTAMP DEFAULT NOW()
);
```

### `crra_calibration` table
```sql
CREATE TABLE crra_calibration (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  -- Add calibration response columns
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Implementation Steps

### Phase 1: Supabase Instance Setup
1. **Create new Supabase project**
   - Sign in to Supabase dashboard
   - Create new project (or restore if possible)
   - Note new project URL and keys

2. **Configure authentication**
   - Enable email/password auth
   - Enable Google OAuth (if needed)
   - Configure OAuth redirect URLs

### Phase 2: Database Schema Creation
1. **Create tables** using SQL editor in Supabase dashboard
2. **Set up Row Level Security (RLS)** policies
3. **Insert default config data**
4. **Create any necessary indexes**

### Phase 3: Environment Configuration
1. **Update `.env.local`** with new Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=new_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=new_anon_key
   SUPABASE_SERVICE_ROLE_KEY=new_service_key (if needed)
   ```

### Phase 4: Code Updates (if needed)
1. **Verify current integration** still works
2. **Update any hardcoded URLs** or deprecated API calls
3. **Test authentication flows**
4. **Test data operations**

### Phase 5: Testing
1. **Test user registration/login**
2. **Test game data persistence**
3. **Test progress tracking**
4. **Verify all game flows work end-to-end**

## Migration Considerations

### Data Migration (if old instance data exists)
- If old data needs to be preserved, export from old instance first
- Import data into new instance
- Verify data integrity

### Environment Variables
- Current config points to: `https://tqpftnrwyvluseznufdy.supabase.co`
- Will need new URL and keys from new project

### OAuth Configuration
- Update OAuth redirect URLs in Google Console (if using Google auth)
- Update Supabase OAuth settings with correct domain

## Risk Mitigation

### Backup Strategy
- Export database schema and data before major changes
- Keep backup of current environment configuration

### Rollback Plan
- Keep current branch as fallback
- Document all changes for easy reversal

### Testing Strategy
- Test in development environment first
- Verify all authentication flows
- Test all game completion flows
- Verify data persistence across sessions

## Success Criteria
- [ ] Students can register/login successfully
- [ ] Game progress is saved and persists across sessions
- [ ] All game features work as expected
- [ ] Instructor can access student results
- [ ] No data loss during gameplay