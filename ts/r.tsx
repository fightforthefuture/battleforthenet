interface R {
	defaultFormText: string
	states: string[]
}

const DEFAULT_FORM_TEXT = `I urge you to stop the FCC's plan to end net neutrality *before* the FCC's December 14th vote.

I don't want ISPs to have the power to block websites, slow them down, give some sites an advantage over others, split the Internet into "fast lanes" for companies that pay and "slow lanes" for the rest, or force me to buy special "tiers" to access the sites and services I choose. But that's exactly what the FCC plan would do. Please read it:

https://apps.fcc.gov/edocs_public/attachmatch/DOC-347927A1.pdf

Blocking & throttling by ISPs is a serious problem. Comcast has throttled Netflix, AT&T blocked FaceTime, Time Warner Cable throttled the popular game League of Legends, and Verizon admitted it will introduce fast lanes for sites that pay-and slow lanes for everyone else-if the FCC lifts the rules. This hurts consumers and businesses large and small.

If some companies can pay ISPs to have their content load faster, startups and small businesses that can't pay those fees won't be able to compete. This will kill the open marketplace that has enabled millions of small businesses and created America’s 5 most valuable companies. Without strong net neutrality protections, Internet providers will effectively be able to impose a tax on every sector of the American economy.

Moreover, under Chairman Pai's plan, ISPs will be able to make it more difficult to access political speech that they don't like. They'll be able to charge fees for website delivery that would make it harder for blogs, nonprofits, artists, and others who can't pay up to have their voices heard.

If the FCC passes their current order, every Internet user and business in this country will be unprotected from abuse by Internet providers, and the consequences will be dire. Please publicly support net neutrality protections by denouncing the FCC's current plan. Do whatever you can to stop Chairman Pai, to ensure that businesses and Internet users remain protected.

Thank you!`;


const STATES = [
	"Alaska",
	"Alabama",
	"Arkansas",
	"Arizona",
	"California",
	"Colorado",
	"Connecticut",
	"District of Columbia",
	"Delaware",
	"Florida",
	"Georgia",
	"Hawaii",
	"Iowa",
	"Idaho",
	"Illinois",
	"Indiana",
	"Kansas",
	"Kentucky",
	"Louisiana",
	"Massachusetts",
	"Maryland",
	"Maine",
	"Michigan",
	"Minnesota",
	"Missouri",
	"Mississippi",
	"Montana",
	"North Carolina",
	"North Dakota",
	"Nebraska",
	"New Hampshire",
	"New Jersey",
	"New Mexico",
	"Nevada",
	"New York",
	"Ohio",
	"Oklahoma",
	"Oregon",
	"Pennsylvania",
	"Rhode Island",
	"South Carolina",
	"South Dakota",
	"Tennessee",
	"Texas",
	"Utah",
	"Virginia",
	"Vermont",
	"Washington",
	"Wisconsin",
	"West Virginia",
	"Wyoming"
]

export var r = {
	defaultFormText: DEFAULT_FORM_TEXT,
	states: STATES
};
