import * as React from 'react';
import {Organization} from './organization';

interface Props {
  org: Organization
  zip: string | ""
}

interface State {
}

export class AfterActionFooter extends React.Component<Props, State> {
  render() {
    // part 2 of zip code hack. TODO: fix this
    const zipCode = this.props.zip || ((window as any)['ZIP_CODE'] as string)

    const donateLink = this.props.org.code == 'fp' ? "https://freepress.actionkit.com/donate/single/" :
                       this.props.org.code == 'dp' ? "https://secure.actblue.com/donate/nndayofaction?refcode=20170712-bftn" :
                       "https://donate.fightforthefuture.org/campaigns/bftnlanding/";

    // const protestLink = "https://actionnetwork.org/event_campaigns/show-up-and-speak-out-for-net-neutrality" + (zipCode ? "?zipcode=" + zipCode : "");
    const protestLink = "https://events.battleforthenet.com/" + (zipCode ? `#zipcode=${zipCode}` : '')
    const videoLink = "https://video.battleforthenet.com/" + (zipCode ? "?fcc_postcode=" + zipCode : "");

    return (
      <div id="after-action-footer">
        <h3>Done calling? Do these things, too!</h3>
        <div className="buttons">
          <div className="row">
            <a className="sp_186482" id="facebook" href="http://shpg.org/103/184601/facebook" target="_blank">
              <button className="facebook">
                <div>
                  <img src="/images/share/facebook_white.svg" />
                  <span>Share</span>
                </div>
              </button>
            </a>
            <a id="twitter" href="https://twitter.com/intent/tweet?related=fightfortheftr&text=What%0A%0A%20if%0A%0A%20the%0A%0A%20Internet%0A%0A%20was%0A%0A%20so%0A%0A%20slow%0A%0A%20it%0A%0A%20loaded%0A%0A%20one%0A%0A%20word%0A%0A%20at%0A%0A%20a%0A%0A%20time?%0A%0A%20Defend%20%23NetNeutrality%20https://www.battleforthenet.com" target="_blank">
              <button className="twitter">
                <div>
                  <img src="/images/share/twitter_white.svg" />
                  <span>Tweet</span>
                </div>
              </button>
            </a>
            <a id="donate" href={donateLink} target="_blank">
              <button className="donate">
                <div>
                  <img src="/images/heart.svg" />
                  <span>Donate</span>
                </div>
              </button>
            </a>
          </div>
          <div className="row">
            <a id="protest" href={protestLink} target="_blank">
              <button className="protest">
                <div>
                  <img src="/images/location-icon.png" />
                  <span>Find a protest near you</span>
                </div>
              </button>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

