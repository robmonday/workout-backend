select *, 
date_trunc('year', start) as year,
date_trunc('month', start) as month,
date_trunc('week', start) as week,
date_trunc('day', start) as day
from "Workout";
