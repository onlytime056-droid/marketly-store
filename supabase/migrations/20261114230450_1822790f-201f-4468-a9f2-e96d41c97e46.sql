create or replace function public.tp_reduce_prices(_pct int default 20)
returns int language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  update public.products set price = greatest(1, round(price * (100 - _pct) / 100.0)) where id > 0;
  get diagnostics n = row_count; return n;
end $$;
create or replace function public.tp_delete_product(_name text)
returns int language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  delete from public.products where name = _name;
  get diagnostics n = row_count; return n;
end $$;
revoke all on function public.tp_reduce_prices(int) from public, anon;
revoke all on function public.tp_delete_product(text) from public, anon;
grant execute on function public.tp_reduce_prices(int) to authenticated;
grant execute on function public.tp_delete_product(text) to authenticated;