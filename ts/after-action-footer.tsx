import * as React from 'react';
import {Organization} from './organization';

interface Props {
  org: Organization
}

interface State {
}

export class AfterActionFooter extends React.Component<Props, State> {
  render() {
    const donateLink = this.props.org.code == 'fp' ? "https://freepress.actionkit.com/donate/single/" :
                       this.props.org.code == 'dp' ? "https://secure.actblue.com/donate/nndayofaction?refcode=20170712-bftn" :
                       "https://donate.fightforthefuture.org/campaigns/bftnlanding/";
    return (
      <div id="after-action-footer">
        <h3>Other ways to help us win...</h3>
        <ul>
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
            <a id='video-link' href="https://video.battleforthenet.com/" target="_blank">
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

