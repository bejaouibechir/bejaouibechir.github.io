import pandas as pd
pd.DataFrame({'id':[1,2,3],'name':['Alice','Bob','Charlie'],'value':[100,200,-5]}).to_parquet('jobs/parquet-job/data/people.parquet')
