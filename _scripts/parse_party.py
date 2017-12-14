import json
import yaml


ret = {}
with open("legislators-current.yaml") as fh:
	data = yaml.load(fh)

m = {
	"Democrat": "d",
	"Republican": "r",
	"Independent": "i",
}
for p in data:
	biocode = p.get("id").get("bioguide")
	last_term = p.get("terms")[-1]
	party = last_term.get("party")
	ret[biocode] = m.get(party, party)

print(json.dumps(ret, indent=2))
