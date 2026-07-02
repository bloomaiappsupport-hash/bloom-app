-- ============================================================
-- RPC function to delete the currently logged in user
-- ============================================================
create or replace function public.delete_user_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;
