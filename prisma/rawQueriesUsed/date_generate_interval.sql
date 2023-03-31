select generate_series(
  date_trunc('day', now()) - '6 days'::interval, -- start at one week ago, rounded to the day
  date_trunc('day', now()), -- stop at now, rounded to the day
  '1 day'::interval -- one hour intervals
) as day