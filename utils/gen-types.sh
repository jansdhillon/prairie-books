#!/bin/bash
npx supabase gen types --lang=typescript --project-id $SUPABASE_PROJECT_ID --schema public > utils/database.types.ts
