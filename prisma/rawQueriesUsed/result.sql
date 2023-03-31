with table1 as (select generate_series(
  date_trunc('day', now()) - '6 days'::interval, 
  date_trunc('day', now()), 
  '1 day'::interval 
)::timestamp as day), table2 as (select 
date_trunc('day', start) as day_w_null, * 
from "Workout"), table3 as (select * from table1 
left join table2 on table1.day = table2.day_w_null) select *, 
extract (epoch from ( coalesce("end", now()) - coalesce("start"  , now()) )) as seconds
from table3 order by day;