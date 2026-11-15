alter table public.products add column if not exists original_price integer;

insert into public.products (name, category, price, image, stock, sold)
select v.name, 'S', v.price, v.img, v.stock, v.sold from (values
('هاتف سامسونج Galaxy S24', 145000, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600', 2, 940),
('ساعة ذكية Apple Watch S9', 78000, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600', 1, 820),
('سماعات Sony WH-1000XM5', 62000, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600', 5, 770),
('حذاء رياضي Nike Air Zoom', 18500, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', 2, 690),
('حقيبة ظهر جلدية فاخرة', 9500, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', 8, 610),
('نظارة شمسية Ray-Ban', 21000, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600', 1, 560),
('كاميرا Canon EOS', 135000, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600', 4, 430),
('لابتوب MacBook Air M3', 210000, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', 2, 410),
('عطر رجالي فاخر 100مل', 12500, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600', 12, 380),
('سماعة بلوتوث محمولة JBL', 15000, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600', 6, 350),
('لوحة مفاتيح ميكانيكية RGB', 11000, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600', 0, 300),
('فأرة لاسلكية Logitech', 5500, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600', 9, 290),
('جهاز لوحي iPad', 98000, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600', 2, 270),
('ساعة يد كلاسيكية', 16000, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600', 7, 250),
('آلة قهوة إسبريسو', 42000, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600', 3, 220),
('كرة قدم احترافية', 4500, 'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=600', 15, 200),
('قميص قطني أنيق', 3800, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', 20, 180),
('مصباح مكتب LED', 4200, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600', 1, 160),
('قارورة ماء حرارية', 2500, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600', 30, 140),
('شاحن سريع 65 واط', 3900, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600', 2, 120)
) as v(name, price, img, stock, sold);

insert into public.products (name, category, price, image, stock, sold)
select 'منتج تجريبي من الفئة S رقم ' || g, 'S', 1000 + (g * 37) % 49000, '', g % 25, g % 90
from generate_series(1, 1980) g;

create or replace function public.tp_reduce_prices(_pct int default 20)
returns int language plpgsql security definer set search_path = public set statement_timeout = '120s' as $$
declare n int;
begin
  update public.products set original_price = price where original_price is null;
  update public.products set price = greatest(1, round(price * (100 - _pct) / 100.0)) where id > 0;
  get diagnostics n = row_count; return n;
end $$;

create or replace function public.tp_reset_prices()
returns int language plpgsql security definer set search_path = public set statement_timeout = '120s' as $$
declare n int;
begin
  update public.products set price = original_price where original_price is not null and price <> original_price;
  get diagnostics n = row_count; return n;
end $$;

create or replace function public.tp_delete_product(_name text)
returns int language plpgsql security definer set search_path = public as $$
declare n int;
begin
  delete from public.products where name = _name;
  get diagnostics n = row_count; return n;
end $$;

grant execute on function public.tp_reduce_prices(int) to anon, authenticated;
grant execute on function public.tp_reset_prices() to anon, authenticated;
grant execute on function public.tp_delete_product(text) to anon, authenticated;