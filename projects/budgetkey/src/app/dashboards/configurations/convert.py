#!/usr/bin/env python
import json
import yaml
import glob
import pathlib

ROOT = pathlib.Path(__file__).parent

# for f in glob.glob('src/app/configurations/*yaml'):
config = {}
for f in ROOT.glob('*.yaml'):
    print(f)
    config[f.stem] = yaml.load(f.open(), Loader=yaml.SafeLoader)
data = json.dumps(config, indent=2, ensure_ascii=False, sort_keys=True)
with (ROOT / 'config.ts').open('w') as out:
    out.write('export const config: any = %s;' % data)
                
