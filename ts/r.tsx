interface R {
	defaultFormText: string
	etsyFormText: string
	states: string[]
}

const DEFAULT_FORM_TEXT = `The FCC's Open Internet Rules (net neutrality rules) are extremely important to me. I urge you to protect them.

I don't want ISPs to have the power to block websites, slow them down, give some sites an advantage over others, or split the Internet into "fast lanes" for companies that pay and "slow lanes" for the rest.

Now is not the time to let giant ISPs censor what we see and do online.

Censorship by ISPs is a serious problem. Comcast has throttled Netflix, AT&T blocked FaceTime, Time Warner Cable throttled the popular game League of Legends, and Verizon admitted it will introduce fast lanes for sites that pay-and slow lanes for everyone else-if the FCC lifts the rules. This hurts consumers and businesses large and small.

Courts have made clear that if the FCC ends Title II classification, the FCC must let ISPs offer "fast lanes" to websites for a fee.

Chairman Pai has made clear that he intends to do exactly this.

But if some companies can pay our ISPs to have their content load faster, startups and small businesses that can't pay those fees won't be able to compete. You will kill the open marketplace that has enabled millions of small businesses and created the 5 most valuable companies in America-just to further enrich a few much less valuable cable giants famous for sky-high prices and abysmal customer service.

Internet providers will be able to impose a private tax on every sector of the American economy.

Moreover, under Chairman Pai's plan, ISPs will be able to make it more difficult to access political speech that they don't like. They'll be able to charge fees for website delivery that would make it harder for blogs, nonprofits, artists, and others who can't pay up to have their voices heard.

I'm sending this to the FCC's open proceeding, but I worry that Chairman Pai, a former Verizon lawyer, has made his plans and will ignore me and millions of other Americans.

So I'm also sending this to my members of Congress. Please publicly support the FCC's existing net neutrality rules based on Title II, and denounce Chairman Pai's plans. Do whatever you can to dissuade him.

Thank you!`;

const ETSY_FORM_TEXT = `Chairman Pai’s proposed plan to repeal net neutrality protections would put a huge burden on microbusinesses like mine.

As an Etsy seller, net neutrality is essential to the success of my business and my ability to care for myself and my family. The FCC needs to ensure equal opportunities for microbusinesses to compete with larger and more established brands by upholding net neutrality protections.

Etsy has opened the door for me and 1.8 million other sellers to turn our passion into a business by connecting us to a global market of buyers. For 32% of creative entrepreneurs on the platform, our creative business is our sole occupation. A decrease in sales in the internet slow lane or higher cost to participate in Chairman Pai’s pay-to-play environment would create significant obstacles for me and other Etsy sellers to care for ourselves and our families.

Moreover, 87% of Etsy sellers in the U.S. are women, and most run their microbusinesses out of their homes. By rolling back the bright line rules that ensure net neutrality, Chairman Pai is not only taking away our livelihood, he is also putting up barriers to entrepreneurship for a whole cohort of Americans.

My business growth depends on equal access to consumers. Any rule that allows broadband providers to negotiate special deals with some companies would undermine my ability to compete online.

We need a free and open internet that works for everyone, not just telecom companies that stand to benefit from the FCC’s proposed rules.

I'm sending this to the FCC's open proceeding and to my members of Congress. Please publicly support the FCC's existing net neutrality rules based on Title II and microbusinesses like mine.

Thank you!`

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
	etsyFormText: ETSY_FORM_TEXT,
	states: STATES
};
