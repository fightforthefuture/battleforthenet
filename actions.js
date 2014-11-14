OAP.jsonp({
    "org": {
        "name": "Battle for the Net",
        "description": "Fight for the Future is dedicated to protecting and expanding the Internet's transformative power in our lives by creating civic campaigns that are engaging for millions of people. Alongside internet users everywhere we beat back attempts to limit our basic rights and freedoms, and empower people to demand technology (and policy) that serves their interests. Activating the internet for the public good can only lead to a more vibrant and awesome world. More coming soon.",
        "url": "https://www.battleforthenet.com",
        "privacy_url": "https://www.battleforthenet.com/privacy"
    },
    "campaigns": [
        {
            "id": "comcast_merger",
            "url": "https://www.battleforthenet.com/comcast",
            "title": "Stop the Comcast / TWC Merger!",
            "image_splash": "http://battle.dev/images/notification.jpg",
            "notification": "Help us stop the Comcast / TWC merger!",
            "description": "Comcast and TWC are the worst companies in America. Now they want to become even bigger and raise prices on consumers by merging. Stop them!",
            "date": "2014-10-10",
            "sharing": {
                "cta": "Help spread the word!",
                "facebook": {
                    "url": "https://www.battleforthenet.com/comcast"
                },
                "twitter": {
                    "text": "Stop the Comcast / TWC merger!",
                    "url": "https://www.battleforthenet.com/comcast"
                }
            },
            "actions": {
                "petitions": [
                    {
                        "id": "comcast_petition",
                        "action": "Sign Petition",
                        "title": "Stop the Comcast / TWC Merger",
                        "letter": {
                            "editable": true,
                            "text": "Dear Chairman Wheeler,\n\nThe proposed merger between Comcast and Time Warner Cable is a disaster and must not be approved. No single firm — and especially one that ranks as the most-hated company in America — should be handed this much power over the future of media and the Internet.\n\nThe combined company would be an Internet and cable TV juggernaut with unmatched power to crush competition and hike prices for consumers. In fact, Comcast has admitted that prices will only go up.\n\nComcast is already the nation's largest Internet provider. With this takeover, Comcast would control the wires reaching into nearly 6 out of every 10 American homes. Comcast has been caught before abusing its gatekeeper power and violating Net Neutrality. Such problems will only worsen if this once-unthinkable deal moves forward.\n\nThere’s no question this takeover would harm the public interest the FCC is supposed to protect. You have said yourself that America has too little broadband competition. I urge you to block the proposed merger of Comcast and Time Warner Cable.",
                            "field": "action_comment"
                        },
                        "endpoint": "https://queue.fightforthefuture.org/action",
                        "method": "post",
                        "fields": [
                            {
                                "name": "tag",
                                "type": "hidden",
                                "value": "comcastmonopoly"
                            },
                            {
                                "name": "member[first_name]",
                                "type": "text",
                                "placeholder": "Your name"
                            },
                            {
                                "name": "member[email]",
                                "type": "text",
                                "placeholder": "Email"
                            },
                            {
                                "name": "member[street_address]",
                                "type": "text",
                                "placeholder": "Street Address"
                            },
                            {
                                "name": "member[postcode]",
                                "type": "text",
                                "placeholder": "Postal Code"
                            },
                            {
                                "name": "submit",
                                "type": "submit",
                                "text": "Send to the FCC"
                            },
                            {
                                "name": "opt_out",
                                "type": "checkbox",
                                "reverse_value": true,
                                "checked": true,
                                "text": "Fight for the Future may contact me with other campaigns"
                            },
                            {
                                "name": "hp_enabled",
                                "type": "hidden",
                                "value": true
                            },
                            {
                                "name": "guard",
                                "type": "hidden",
                                "value": ""
                            }
                        ],
                        "disclosure": "We'll deliver this letter to the FCC, your members of Congress and the White House. We'll never share your email with anyone else.",
                        "privacy_policy": "https://www.battleforthenet.com/privacy",
                        "next": {
                            "id": "comcast_call",
                            "overrides": {
                                "subtitle": "Thanks! Now can you call?"
                            }
                        }
                    }
                ],
                "calls": [
                    {
                        "id": "comcast_call",
                        "action": "Call Congress",
                        "subtitle": "Call Congress: Stop the Merger!",
                        "content": "Calls have 10 times the impact of emails. Calling is easy: we'll call your phone and tell you exactly what to say. We won't save your number or use it for anything else.",
                        "bottom_content": "Can't call? <a href=\"#comcast_share\">Share the campaign</a> or <a href=\"https://donate.fightforthefuture.org?tag=comcastmonopoly\">donate $1 to help us get more callers!</a>",
                        "endpoint": "https://call-congress.fightforthefuture.org/create",
                        "method": "get",
                        "fields": [
                            {
                                "name": "campaignId",
                                "type": "hidden",
                                "value": "comcastmonopoly"
                            },
                            {
                                "name": "userPhone",
                                "type": "text",
                                "placeholder": "Enter your phone number."
                            },
                            {
                                "name": "submit",
                                "type": "submit",
                                "text": "<strong>Get connected</strong> to the FCC"
                            }
                        ],
                        "show_sharing_links": false,
                        "next": {
                            "id": "comcast_share",
                            "overrides": {
                                "subtitle": "Awesome&mdash;we're calling your phone!",
                                "content": "When the FCC answers, say the FCC should block the Comcast-Time Warner Cable merger, because no company should have that much power over the Internet. Leave voicemail if necessary! Then press * and ask your representative to take a public position against the merger."
                            }
                        }
                    }
                ],
                "modals": [
                    {
                        "id": "comcast_share",
                        "subtitle": "Thanks for taking action!",
                        "content": "To win, we need tons more people to do what you just did. Lead by example! Please share this campaign.",
                        "bottom_content": "Want to do more? <a href=\"https://donate.fightforthefuture.org?tag=comcastmonopoly\">Donate $1 to help us get more callers!</a>",
                        "show_sharing_links": true
                    }
                ]
            }
        },
        {
            "id": "battleforthenet",
            "url": "https://www.battleforthenet.com",
            "title": "Battle for the Net!",
            "image_splash": "http://battle.dev/images/notification.jpg",
            "date": "2014-09-10",
            "notification": "Deadline: tell the FCC to defend net neutrality!",
            "description": "The FCC is poised to destroy net neutrality forever! Help us stop them!",
            "sharing": {
                "cta": "Help spread the word!",
                "facebook": {
                    "url": "https://www.battleforthenet.com"
                },
                "twitter": {
                    "text": "Stop the FCC from destroying net neutrality!",
                    "url": "https://www.battleforthenet.com"
                }
            }
        }
    ]
});
