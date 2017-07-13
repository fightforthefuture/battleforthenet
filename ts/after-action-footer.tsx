import * as React from 'react';
import {User} from './user';
import {Organization} from './organization';

interface Props {
  org: Organization
  userData: User
}

interface State {
}

export class AfterActionFooter extends React.Component<Props, State> {
  render() {
    const userData = this.props.userData;

    const donateLink = this.props.org.code == 'fp' ? "https://freepress.actionkit.com/donate/single/" :
                       this.props.org.code == 'dp' ? "https://secure.actblue.com/donate/nndayofaction?refcode=20170712-bftn" :
                       "https://donate.fightforthefuture.org/campaigns/bftnlanding/";
    const protestLink = "https://actionnetwork.org/event_campaigns/show-up-and-speak-out-for-net-neutrality" + (userData.zip ? "?zipcode=" + userData.zip : "");
    const videoLink = "https://video.battleforthenet.com/?fcc_name=" + userData.name + "&fcc_email=" + userData.email + "&fcc_address=" + userData.address + "&fcc_postcode=" + userData.zip;

    return (
      <div id="after-action-footer">
        <h3>Other ways to help us win...</h3>
        <ul>
          <li>
            <a id="protest" href={protestLink} target="_blank">
              <button className="protest">
                <div>
                  <img src="images/pin.svg" />
                  <span>Protest</span>
                </div>
              </button>
            </a>
          </li>
          <li>
            <a id="donate" href={donateLink} target="_blank">
              <button className="donate">
                <div>
                  <img src="/images/heart.svg" />
                  <span>Donate</span>
                </div>
              </button>
            </a>
          </li>
          <li>
            <a id='video-link' href={videoLink} target="_blank">
              <button className="video">
                <div>
                  <img src="/images/video.svg" />
                  <span>Send a Video</span>
                </div>
              </button>
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

