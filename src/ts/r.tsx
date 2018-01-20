interface R {
	defaultFormText: string
	states: string[]
}

const DEFAULT_FORM_TEXT = `The FCC vote to destroy the Net Neutrality protections on Dec. 14 cannot stand. 

I’m calling on you to work with your colleagues to use the Congressional Review Act to pass a "resolution of disapproval" reversing the FCC's vote. 

The FCC's Dec. 14 decision willfully ignored the outcry from tens of millions of people, and it abdicated the FCC's responsibility to protect the internet from ISP blocking and discrimination. The FCC has injured our economy and free speech in just one action, all without so much as a single public hearing. 

We need members of Congress to stand up for the open internet and for the digital civil rights of their constituents now. Please co-sponsor, sign the discharge petition, and vote for the CRA to pass a Resolution of Disapproval overturning the FCC's December 14 "Restoring Internet Freedom" vote. 

Thank you.`;


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
