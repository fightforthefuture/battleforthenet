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
    const protestLink = "https://actionnetwork.org/event_campaigns/show-up-and-speak-out-for-net-neutrality" + (this.props.zip ? "?zipcode=" + this.props.zip : "");
    const videoLink = "https://video.battleforthenet.com/" + (this.props.zip ? "?fcc_postcode=" + this.props.zip : "");

    return (
      <div id="after-action-footer">
        <h3>Done calling? Help drive more calls!</h3>
        <ul>
          <li>
            <a id="facebook" href="https://www.facebook.com/sharer.php?u=https://www.battleforthenet.com/" target="_blank">
              <button className="facebook">
                <div>
                  <img src="/images/share/facebook_white.svg" />
                  <span>Share</span>
                </div>
              </button>
            </a>
          </li>
          <li>
            <a id="twitter" href="https://twitter.com/intent/tweet?related=fightfortheftr&text=What%0A%0A%20if%0A%0A%20the%0A%0A%20Internet%0A%0A%20was%0A%0A%20so%0A%0A%20slow%0A%0A%20it%0A%0A%20loaded%0A%0A%20one%0A%0A%20word%0A%0A%20at%0A%0A%20a%0A%0A%20time?%0A%0A%20Defend%20%23NetNeutrality%20https://www.battleforthenet.com" target="_blank">
              <button className="twitter">
                <div>
                  <img src="/images/share/twitter_white.svg" />
                  <span>Tweet</span>
                </div>
              </button>
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

